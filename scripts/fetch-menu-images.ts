/**
 * Best-effort per-item photo fetcher for the quote builder.
 *
 * Searches Wikimedia Commons for each catalogue item, keeps a result only when
 * its file name actually shares a meaningful word with the dish, and downloads a
 * 500px thumbnail into src/assets/menu/. Attribution for every kept file is
 * written to src/data/menu-images.json so the site can credit CC-BY images.
 *
 * Run: bun scripts/fetch-menu-images.ts [--only=<category-id>] [--force]
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import { ALL_CATEGORIES, slugify, type MenuCategory } from "../src/data/menu";

const OUT_DIR = path.join(import.meta.dir, "..", "src", "assets", "menu");
const MANIFEST = path.join(import.meta.dir, "..", "src", "data", "menu-images.json");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "SVCaterersMenuImageFetcher/1.0 (static catering website build script)";
const CONCURRENCY = 2;
const PACE_MS = 220;
const MAX_RETRIES = 5;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Commons throttles bursts, and a throttled request looks exactly like "no photo
 * exists" to the caller — an earlier run silently matched 3 of 474 items that way.
 * Retry on 429/5xx, honouring Retry-After, and surface anything still failing.
 */
let failures = 0;
async function politeFetch(url: URL | string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (res.ok) return res;
    if (attempt >= MAX_RETRIES || (res.status < 500 && res.status !== 429)) {
      failures++;
      return res;
    }
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 600;
    await sleep(wait);
  }
}

type Entry = {
  file: string;
  artist: string;
  license: string;
  source: string;
  query: string;
  /** true when the photo is of the category, not of that exact dish. */
  approx?: boolean;
};

// Last-resort search term per category: a real photo of the right kind of food
// beats a generic banner when Commons has nothing for the exact dish.
const CATEGORY_TERM: Record<string, string> = {
  starters: "Indian appetizer starter",
  "special-entree": "paneer curry",
  "seasonal-entree": "Indian vegetable curry",
  rice: "Indian rice pulao",
  dal: "dal lentil curry",
  breads: "Indian bread roti",
  sweets: "Indian sweets mithai",
  desserts: "ice cream dessert",
  curd: "raita yoghurt",
  aachar: "Indian pickle achar",
  pakoras: "pakora fritter",
  chaat: "Indian chaat street food",
  "live-stalls": "Indian street food stall",
  "live-counters": "momo dumpling",
  chinese: "hakka noodles",
  "cuisine-specials": "Indian thali",
  soups: "soup bowl",
  salad: "Indian salad",
  papad: "papad",
  beverages: "Indian tea drink",
  shakes: "milkshake",
  mocktails: "mocktail drink",
  "nv-starters-chicken": "chicken tikka kebab",
  "nv-starters-mutton": "mutton kebab",
  "nv-starters-fish": "fried fish Indian",
  "nv-entree-chicken": "chicken curry",
  "nv-entree-mutton": "mutton curry",
  "nv-entree-fish": "fish curry",
  "nv-soups": "chicken soup",
  "nv-rice": "biryani",
};
type Manifest = Record<string, Entry>;

// Words too generic to prove a search hit is really the right dish.
const WEAK = new Set([
  "veg",
  "vegetable",
  "non",
  "dry",
  "fry",
  "fried",
  "plain",
  "mix",
  "mixed",
  "special",
  "counter",
  "with",
  "and",
  "live",
  "the",
  "one",
  "two",
  "sauce",
  "style",
  "masala",
  "curry",
  "gravy",
  "dish",
  "simple",
  "assorted",
  "type",
  "boneless",
  "bone",
  "hot",
]);

function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

// Commons file names use their own transliterations, so "Onion Pakora" lives at
// "Onion pakoda.jpg". Each group below is treated as one word when matching.
const SYNONYMS: string[][] = [
  ["pakora", "pakoda", "pakodi", "fritter"],
  ["bhajiya", "bhaji", "bhajji", "bhajia"],
  ["chatni", "chutney"],
  ["kabab", "kebab", "kabob"],
  ["mutter", "matar", "mattar", "peas"],
  ["aloo", "alu", "potato"],
  ["gobi", "gobhi", "cauliflower"],
  ["baigan", "baingan", "brinjal", "eggplant", "aubergine"],
  ["karhi", "kadhi", "kadi"],
  ["chaat", "chat"],
  ["puri", "poori", "puris"],
  ["bhindi", "okra"],
  ["dahi", "curd", "yoghurt", "yogurt"],
  ["jeera", "cumin"],
  ["lehsun", "garlic"],
  ["paratha", "parantha", "parotta"],
  ["roti", "chapati", "chapatti"],
  ["laddu", "ladoo", "laddoo"],
  ["barfi", "burfi"],
  ["jalebi", "jilebi"],
  ["kheer", "payasam"],
  ["mirchi", "mirch", "chilli", "chili", "chilly"],
  ["schezwan", "szechwan", "sichuan", "szechuan"],
  ["manchurian", "manchuria"],
  ["biryani", "biriyani", "biriani"],
  ["pulao", "pilaf", "pulav"],
  ["soya", "soy"],
  ["mushroom", "mushrooms"],
  ["momo", "momos", "dumpling"],
];

const VARIANTS = new Map<string, string[]>();
for (const group of SYNONYMS) {
  for (const word of group) VARIANTS.set(word, group);
}

function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j]!;
      prev[j] = Math.min(
        prev[j]! + 1,
        prev[j - 1]! + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = temp;
    }
  }
  return prev[b.length]!;
}

/** A haystack word counts as the token when it is the same word, a known
 *  transliteration of it, or within one character of it. */
function wordMatches(token: string, words: string[]): boolean {
  const accepted = VARIANTS.get(token) ?? [token];
  return words.some((word) =>
    accepted.some(
      (variant) =>
        word === variant ||
        word.startsWith(variant) ||
        (variant.length >= 5 && levenshtein(word, variant) <= 1),
    ),
  );
}

function isRelevant(haystackText: string, item: string): boolean {
  const words = haystackText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const all = tokens(item);
  const strong = all.filter((t) => !WEAK.has(t));
  const required = strong.length > 0 ? strong : all;
  return required.some((token) => wordMatches(token, words));
}

function stripHtml(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type Candidate = {
  title: string;
  text: string;
  thumb: string;
  artist: string;
  license: string;
  page: string;
};

async function search(query: string): Promise<Candidate[]> {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime",
    iiurlwidth: "500",
  }).toString();

  const res = await politeFetch(url);
  if (!res.ok) throw new Error(`search failed ${res.status}`);
  await sleep(PACE_MS);
  const data = (await res.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          title: string;
          imageinfo?: {
            thumburl?: string;
            mime?: string;
            descriptionurl?: string;
            extmetadata?: Record<string, { value?: string }>;
          }[];
        }
      >;
    };
  };
  const pages = Object.values(data.query?.pages ?? {});
  const out: Candidate[] = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) continue;
    if (info.mime && !/^image\/(jpeg|png|webp)$/.test(info.mime)) continue;
    const description = stripHtml(info.extmetadata?.["ImageDescription"]?.value);
    const objectName = stripHtml(info.extmetadata?.["ObjectName"]?.value);
    const title = page.title.replace(/^File:/, "");
    out.push({
      title,
      text: `${title} ${objectName} ${description}`.slice(0, 400),
      thumb: info.thumburl,
      artist: stripHtml(info.extmetadata?.["Artist"]?.value) || "Wikimedia Commons",
      license: stripHtml(info.extmetadata?.["LicenseShortName"]?.value) || "see source",
      page: info.descriptionurl ?? "https://commons.wikimedia.org",
    });
  }
  return out;
}

async function download(url: string, dest: string): Promise<boolean> {
  const res = await politeFetch(url);
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < 2000) return false; // a broken/blank thumbnail
  await writeFile(dest, buf);
  return true;
}

async function loadManifest(): Promise<Manifest> {
  if (!existsSync(MANIFEST)) return {};
  return JSON.parse(await readFile(MANIFEST, "utf8")) as Manifest;
}

async function resolveItem(
  item: string,
  category: MenuCategory,
  itemIndex: number,
): Promise<(Omit<Entry, "file"> & { thumb: string }) | undefined> {
  const attempts = [`${item} food`, `${item} Indian dish`, `${item}`];
  for (const query of attempts) {
    let candidates: Candidate[] = [];
    try {
      candidates = await search(query);
    } catch {
      continue;
    }
    const hit = candidates.find((c) => isRelevant(c.text, item));
    if (hit) {
      return {
        thumb: hit.thumb,
        artist: hit.artist,
        license: hit.license,
        source: hit.page,
        query: `${query} → ${hit.title}`,
      };
    }
  }
  // Nothing for the dish itself — fall back to a photo of the category, picking a
  // different candidate per item so a category grid does not repeat one image.
  const term = CATEGORY_TERM[category.id];
  if (term) {
    try {
      const candidates = await search(term);
      const pick = candidates[itemIndex % Math.max(candidates.length, 1)];
      if (pick) {
        return {
          thumb: pick.thumb,
          artist: pick.artist,
          license: pick.license,
          source: pick.page,
          query: `${term} (category fallback) → ${pick.title}`,
          approx: true,
        };
      }
    } catch {
      // fall through to no image
    }
  }
  return undefined;
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const force = process.argv.includes("--force");
  const only = onlyArg?.split("=")[1];

  await mkdir(OUT_DIR, { recursive: true });
  const manifest = await loadManifest();

  const jobs: { item: string; slug: string; category: MenuCategory; index: number }[] = [];
  for (const category of ALL_CATEGORIES) {
    if (only && category.id !== only) continue;
    for (const [index, item] of category.items.entries()) {
      const slug = slugify(item);
      if (!force && manifest[slug] && existsSync(path.join(OUT_DIR, manifest[slug]!.file)))
        continue;
      if (jobs.some((j) => j.slug === slug)) continue;
      jobs.push({ item, slug, category, index });
    }
  }

  console.log(`${jobs.length} item(s) to resolve`);
  let done = 0;
  let matched = 0;

  async function worker() {
    for (;;) {
      const job = jobs.shift();
      if (!job) return;
      const resolved = await resolveItem(job.item, job.category, job.index);
      done++;
      if (resolved) {
        const ext = path.extname(new URL(resolved.thumb).pathname).toLowerCase() || ".jpg";
        const file = `${job.slug}${ext === ".webp" ? ".webp" : ext === ".png" ? ".png" : ".jpg"}`;
        const ok = await download(resolved.thumb, path.join(OUT_DIR, file));
        if (ok) {
          matched++;
          manifest[job.slug] = {
            file,
            artist: resolved.artist,
            license: resolved.license,
            source: resolved.source,
            query: resolved.query,
            ...(resolved.approx ? { approx: true } : {}),
          };
        }
      }
      if (done % 25 === 0) {
        console.log(`  ${done} done, ${matched} matched`);
        await writeFile(MANIFEST, `${JSON.stringify(sorted(manifest), null, 2)}\n`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await writeFile(MANIFEST, `${JSON.stringify(sorted(manifest), null, 2)}\n`);
  console.log(
    `finished: ${matched} newly matched, ${Object.keys(manifest).length} total in manifest, ${failures} request failure(s)`,
  );
}

function sorted(manifest: Manifest): Manifest {
  return Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
}

await main();
