// Renders the customer's menu selection as a menu card, styled after the
// printed SV Caterers card: cream page, gold frame, gold category banners and
// two columns of diamond-bulleted dishes. Names and categories only — rates are
// quoted after the enquiry.
import { BUSINESS } from "@/components/SiteChrome";

/** One category block: its items, split by section when a menu mixes veg and non-veg. */
export type QuoteSelection = {
  category: string;
  groups: { label: string | null; items: string[] }[];
}[];

export type QuoteMeta = {
  diet: "veg" | "nonveg";
  name?: string;
  phone?: string;
  email?: string;
  eventDate?: string;
  guests?: string;
};

type Doc = import("jspdf").jsPDF;

const CREAM: [number, number, number] = [253, 249, 240];
const GOLD: [number, number, number] = [176, 126, 24];
const GOLD_DEEP: [number, number, number] = [124, 84, 12];
const GOLD_SOFT: [number, number, number] = [214, 176, 96];
const INK: [number, number, number] = [62, 47, 26];

const MARGIN = 34;
const FRAME_INSET = 10;
const COLUMN_GAP = 22;
const BANNER_HEIGHT = 21;
const ITEM_LINE = 14;

function formatDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Cream page + double gold frame with corner flourishes, drawn on every page. */
function drawPageChrome(doc: Doc) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(...CREAM);
  doc.rect(0, 0, w, h, "F");

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.6);
  doc.rect(MARGIN / 2, MARGIN / 2, w - MARGIN, h - MARGIN);

  doc.setDrawColor(...GOLD_SOFT);
  doc.setLineWidth(0.6);
  doc.rect(
    MARGIN / 2 + FRAME_INSET,
    MARGIN / 2 + FRAME_INSET,
    w - MARGIN - FRAME_INSET * 2,
    h - MARGIN - FRAME_INSET * 2,
  );

  // Corner flourishes: a pair of short arcs tucked inside each corner.
  const corners: [number, number, number, number][] = [
    [MARGIN / 2 + FRAME_INSET, MARGIN / 2 + FRAME_INSET, 1, 1],
    [w - MARGIN / 2 - FRAME_INSET, MARGIN / 2 + FRAME_INSET, -1, 1],
    [MARGIN / 2 + FRAME_INSET, h - MARGIN / 2 - FRAME_INSET, 1, -1],
    [w - MARGIN / 2 - FRAME_INSET, h - MARGIN / 2 - FRAME_INSET, -1, -1],
  ];
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  for (const [x, y, sx, sy] of corners) {
    const inX = x + 7 * sx;
    const inY = y + 7 * sy;
    doc.lines([[22 * sx, 0]], inX, inY, [1, 1], "S");
    doc.lines([[0, 22 * sy]], inX, inY, [1, 1], "S");
    doc.setFillColor(...GOLD);
    doc.circle(inX + 27 * sx, inY, 1.5, "F");
    doc.circle(inX, inY + 27 * sy, 1.5, "F");
  }
}

/** Vertical rule between the two columns, capped with diamonds. */
function drawColumnDivider(doc: Doc, topY: number, bottomY: number) {
  const centerX = doc.internal.pageSize.getWidth() / 2;
  doc.setDrawColor(...GOLD_SOFT);
  doc.setLineWidth(0.6);
  doc.line(centerX, topY + 10, centerX, bottomY - 10);
  diamond(doc, centerX, topY + 6, 2.6);
  diamond(doc, centerX, bottomY - 4, 2.6);
}

function diamond(doc: Doc, x: number, y: number, size = 2.2) {
  doc.setFillColor(...GOLD);
  doc.lines(
    [
      [size, size],
      [-size, size],
      [-size, -size],
      [size, -size],
    ],
    x,
    y - size,
    [1, 1],
    "F",
  );
}

/** Thin ornament: a rule with a diamond centred on it. */
function ornament(doc: Doc, y: number, halfWidth: number, centerX: number) {
  doc.setDrawColor(...GOLD_SOFT);
  doc.setLineWidth(0.6);
  doc.line(centerX - halfWidth, y, centerX - 8, y);
  doc.line(centerX + 8, y, centerX + halfWidth, y);
  diamond(doc, centerX, y, 3);
}

function drawHeader(doc: Doc, meta: QuoteMeta, total: number): number {
  const w = doc.internal.pageSize.getWidth();
  const centerX = w / 2;
  let y = MARGIN / 2 + FRAME_INSET + 42;

  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.setTextColor(...GOLD_DEEP);
  doc.text("SV CATERERS", centerX, y, { align: "center" });
  y += 16;

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text(BUSINESS.motto.toUpperCase(), centerX, y, { align: "center" });
  y += 14;

  ornament(doc, y, 120, centerX);
  y += 20;

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(
    meta.diet === "veg" ? "SELECTED MENU · PURE VEG" : "SELECTED MENU · VEG & NON-VEG",
    centerX,
    y,
    { align: "center" },
  );
  y += 14;

  const details = [
    meta.name,
    meta.guests ? `${meta.guests} guests` : undefined,
    formatDate(meta.eventDate),
    meta.phone,
    meta.email,
  ].filter(Boolean) as string[];

  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GOLD_DEEP);
  if (details.length > 0) {
    const maxWidth = w - MARGIN - FRAME_INSET * 2 - 60;
    const lines = doc.splitTextToSize(details.join("   ·   "), maxWidth) as string[];
    for (const line of lines) {
      doc.text(line, centerX, y, { align: "center" });
      y += 12;
    }
  }
  doc.setFontSize(8.5);
  doc.setTextColor(150, 130, 100);
  doc.text(`${total} item${total === 1 ? "" : "s"} selected`, centerX, y, { align: "center" });

  return y + 20;
}

function drawFooter(doc: Doc) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const centerX = w / 2;
  const y = h - MARGIN / 2 - FRAME_INSET - 22;

  ornament(doc, y - 14, 150, centerX);

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...GOLD_DEEP);
  doc.text(`${BUSINESS.phone}    |    ${BUSINESS.email}    |    ${BUSINESS.city}`, centerX, y, {
    align: "center",
  });

  doc.setFont("times", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(160, 140, 110);
  doc.text("Rates quoted after confirming date, venue and guest count.", centerX, y + 11, {
    align: "center",
  });
  doc.setFont("times", "normal");
  doc.setFontSize(7);
  doc.setTextColor(175, 158, 130);
  doc.text(`Created ${createdAt()}`, centerX, y + 21, { align: "center" });
}

/** Stamped on every page footer so an old printout is easy to spot. */
function createdAt(): string {
  return new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function drawBanner(doc: Doc, x: number, y: number, width: number, title: string) {
  doc.setFillColor(...GOLD);
  doc.roundedRect(x, y, width, BANNER_HEIGHT, BANNER_HEIGHT / 2, BANNER_HEIGHT / 2, "F");

  // Icon medallion on the left of the banner.
  doc.setFillColor(...GOLD_DEEP);
  doc.circle(x + BANNER_HEIGHT / 2, y + BANNER_HEIGHT / 2, BANNER_HEIGHT / 2 - 1.5, "F");
  doc.setFillColor(...CREAM);
  doc.circle(x + BANNER_HEIGHT / 2, y + BANNER_HEIGHT / 2, 2.4, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(255, 253, 248);
  const label = title.toUpperCase();
  const maxWidth = width - BANNER_HEIGHT - 14;
  let fontSize = 10.5;
  while (doc.getTextWidth(label) > maxWidth && fontSize > 7) {
    fontSize -= 0.5;
    doc.setFontSize(fontSize);
  }
  doc.text(label, x + BANNER_HEIGHT + 4, y + BANNER_HEIGHT / 2 + 3.4);
}

type Row = { kind: "label"; text: string } | { kind: "item"; lines: string[] };
type Block = { title: string; rows: Row[] };

const LABEL_LINE = 15;

/** Pre-wraps every item so column heights can be measured before drawing. */
function buildBlocks(doc: Doc, selection: QuoteSelection, columnWidth: number): Block[] {
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  return selection.map((entry) => {
    const rows: Row[] = [];
    for (const group of entry.groups) {
      if (group.items.length === 0) continue;
      if (group.label) rows.push({ kind: "label", text: group.label });
      for (const item of group.items) {
        rows.push({ kind: "item", lines: doc.splitTextToSize(item, columnWidth - 18) as string[] });
      }
    }
    return { title: entry.category, rows };
  });
}

function rowHeight(row: Row): number {
  return row.kind === "label" ? LABEL_LINE : row.lines.length * ITEM_LINE;
}

function blockHeight(block: Block): number {
  return BANNER_HEIGHT + 8 + block.rows.reduce((sum, row) => sum + rowHeight(row), 0) + 14;
}

export async function buildQuotePdf(
  selection: QuoteSelection,
  meta: QuoteMeta,
): Promise<{ blob: Blob; url: string; filename: string }> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentLeft = MARGIN / 2 + FRAME_INSET + 16;
  const contentRight = pageWidth - MARGIN / 2 - FRAME_INSET - 16;
  const contentWidth = contentRight - contentLeft;
  const columnWidth = (contentWidth - COLUMN_GAP) / 2;
  const columnX = [contentLeft, contentLeft + columnWidth + COLUMN_GAP];
  const bottomLimit = pageHeight - MARGIN / 2 - FRAME_INSET - 52;

  const total = selection.reduce(
    (sum, entry) => sum + entry.groups.reduce((n, group) => n + group.items.length, 0),
    0,
  );
  const blocks = buildBlocks(doc, selection, columnWidth);

  drawPageChrome(doc);
  let top = drawHeader(doc, meta, total);
  drawFooter(doc);
  drawColumnDivider(doc, top, bottomLimit);

  let column = 0;
  const columnY = [top, top];

  function nextPage() {
    doc.addPage();
    drawPageChrome(doc);
    drawFooter(doc);
    top = MARGIN / 2 + FRAME_INSET + 34;
    drawColumnDivider(doc, top, bottomLimit);
    columnY[0] = top;
    columnY[1] = top;
    column = 0;
  }

  for (const block of blocks) {
    const height = blockHeight(block);
    // Prefer the shorter column so the card stays visually balanced.
    column = columnY[0]! <= columnY[1]! ? 0 : 1;

    if (columnY[column]! + height > bottomLimit) {
      const other = column === 0 ? 1 : 0;
      if (columnY[other]! + height <= bottomLimit) {
        column = other;
      } else if (columnY[column]! + BANNER_HEIGHT + 30 > bottomLimit) {
        nextPage();
      }
    }

    const x = columnX[column]!;
    let y = columnY[column]!;

    drawBanner(doc, x, y, columnWidth, block.title);
    y += BANNER_HEIGHT + 12;

    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    for (const row of block.rows) {
      if (y + rowHeight(row) > bottomLimit) {
        // Item list outgrew the page: continue it in the other column or overleaf.
        const other = column === 0 ? 1 : 0;
        if (columnY[other]! + 40 < bottomLimit && other !== column) {
          columnY[column] = y + 10;
          column = other;
          y = columnY[column]!;
        } else {
          columnY[column] = y + 10;
          nextPage();
          y = columnY[column]!;
        }
        drawBanner(doc, columnX[column]!, y, columnWidth, `${block.title} (contd.)`);
        y += BANNER_HEIGHT + 12;
        doc.setFont("times", "normal");
        doc.setFontSize(10.5);
      }
      const lineX = columnX[column]!;
      if (row.kind === "label") {
        doc.setFont("times", "bolditalic");
        doc.setFontSize(9.5);
        doc.setTextColor(...GOLD_DEEP);
        doc.text(row.text, lineX + 7, y + 3);
        doc.setFont("times", "normal");
        doc.setFontSize(10.5);
        y += LABEL_LINE;
        continue;
      }
      diamond(doc, lineX + 7, y - 3);
      doc.setTextColor(...INK);
      row.lines.forEach((line, index) => {
        doc.text(line, lineX + 16, y + index * ITEM_LINE);
      });
      y += row.lines.length * ITEM_LINE;
    }

    columnY[column] = y + 16;
  }

  const blob = doc.output("blob") as Blob;
  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: `sv-caterers-menu-${new Date().toISOString().slice(0, 10)}.pdf`,
  };
}
