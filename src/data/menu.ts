// Catering item catalogue used by the step-wise quote builder (/quote).
//
// A category holds one or more sections. Veg-only categories have a single
// section; the ones that also come in meat or fish keep those as separate
// sections so a non-veg menu shows "Non-Veg" and "Veg" apart inside the same
// step. `categoriesFor("veg")` simply drops the non-veg sections.

export type SectionDiet = "veg" | "nonveg";

export type MenuSection = {
  /** Shown above the items when a category has more than one section. */
  label: string;
  diet: SectionDiet;
  items: string[];
};

export type MenuCategory = {
  id: string;
  title: string;
  /** Shown under the step heading to explain what the category covers. */
  blurb: string;
  sections: MenuSection[];
};

export type Diet = "veg" | "nonveg";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const VEG_STARTERS = [
  "Paneer Tikka Dry",
  "Paneer Malai Tikka",
  "Kasturi Paneer",
  "Paneer Achari Tikka",
  "Nizami Paneer",
  "Paneer Lollipop",
  "Paneer 65",
  "Paneer Soti Boti",
  "Hakka Paneer",
  "Spicy Shanghai Paneer",
  "Schezwan Paneer",
  "Veg Gold Finger",
  "Chilly Paneer",
  "Veg Spring Rolls",
  "Veg Shanghai Rolls",
  "Veg Manchurian Dry",
  "Gobi Manchurian Dry",
  "Mushroom Manchurian Dry",
  "Veg Bullets",
  "French Fries",
  "Paneer Seekh Kebab",
  "Veg Seekh Kebab",
  "Hara Bhara Kabab",
  "Methi Corn Kebab",
  "Chilly Potato",
  "Gobi 65",
  "Paneer Pakoda",
  "Mix Veg Pakoda",
  "Mushroom 65",
  "Aloo 65",
  "Methi Muthia",
  "Sabudana Tikki",
  "Veg Crispy",
  "Veg Cutlet",
  "Cheese Balls",
  "Soya Chaap Tikka",
  "Malai Soya Chaap Tikka",
  "Veg Momos",
  "Lemon Chilly Mini Idli with Coconut Sauce",
];

const NV_STARTERS_CHICKEN = [
  "Chicken Malai Tikka",
  "Chicken Haryali Tikka",
  "Chicken Masala Tikka",
  "Chicken Manchurian",
  "Chicken Lollipop",
  "Chicken Tangri Tandoori",
  "Chicken Seekh",
  "Chicken Kebab",
  "Chilly Chicken Boneless",
  "Chilly Chicken With Bone",
  "Chicken 65 Boneless",
  "Chicken 65 With Bone",
  "Chicken Cutlet",
  "Chicken Pakora",
  "Chicken Grilled Sizzler",
  "Fried Chicken Boneless",
  "Fried Chicken With Bone",
  "Chicken Seekh Kebab",
  "Chicken Salami",
  "Chicken Shahi Kebab",
  "Chicken Schezwan Lollipop",
  "Chicken Pahadi Tikka",
  "Chicken Reshmi Kebab",
  "Chicken Meat Ball",
  "Malai Chicken Tangdi Kebab",
];

const NV_STARTERS_MUTTON = [
  "Mutton Seekh",
  "Mutton Shammi Kabab",
  "Mutton Lollipop",
  "Mutton Kebab",
  "Mutton 65",
  "Mutton Fry",
  "Mutton Sukha",
  "Mutton Pepper Fry",
  "Mutton Dry Roast",
  "Mutton Spicy Chops",
  "Galouti Kebab",
];

const NV_STARTERS_FISH = [
  "Fish Amritsari",
  "Fish Finger",
  "Fish Tikka Masala",
  "Fish Tikka Malai",
  "Pomfret Tandoori",
  "Fried Fish",
];

const VEG_SPECIAL_ENTREE = [
  "Paneer Makhni",
  "Paneer Kadhai",
  "Paneer Palak",
  "Paneer Mutter",
  "Paneer Butter Masala",
  "Paneer Laccha",
  "Paneer Tikka Masala",
  "Paneer Lucknowi",
  "Paneer Lababdar",
  "Paneer Tak-a-Tak",
  "Paneer Amritsari",
  "Paneer Chatpata",
  "Paneer Saagwala",
  "Paneer Lazeez",
  "Paneer Khurchan",
  "Paneer Do Pyaza",
  "Palak Kofta",
  "Chana Masala",
  "Rajmah Masala",
  "Dum Aloo Kashmiri",
  "Pathvali Bhaaji",
  "Chana Paneer",
  "Mutter Methi Malai",
  "Malai Methi Kaju",
  "Navaratan Korma",
  "Veg Jaipuri",
  "Kashmiri Kofta",
  "Veg Egg Curry",
  "Baby Corn Mutter",
  "Paneer Passanda",
  "Malai Kofta",
  "Nargisi Kofta",
  "Mughlai Kofta",
  "Soya Chaap Masala",
  "Veg Angoori",
];

const VEG_SEASONAL_ENTREE = [
  "Masala Fannas",
  "Masala Kumbda",
  "Aloo Gobi Masala",
  "Lauki Kofta Masala",
  "Masala Karela",
  "Masala Baigan",
  "Sarso Da Saag",
  "Cluster Beans Masala",
  "Dal Kanda",
  "Baigan Bharta",
  "Mixed Veg",
  "Tawa Veg",
  "Jhunka",
  "Bhindi Fry",
  "Gobi Mutter Masala",
  "Chole Masala",
  "Dum Aloo Masala",
  "Aloo Palak",
  "Aloo Methi",
  "Aloo Mutter",
  "Bhindi Masala",
  "Baigan Aloo",
  "Aloo Rassewalla",
  "Capsicum Masala",
  "Kolhapuri Kofta",
  "Moong Matki Usad",
  "Tomato Chatni",
  "Plain Kofta",
  "Veg Kofta",
  "Baby Corn Palak",
  "Amritsari Chana",
  "Mughlai Gobi",
  "Gobi Mutter Punjabi",
  "Bharwa Karela",
  "Bharwa Bhindi",
  "Bharwa Shimla",
  "Bhindi Do Pyaza",
  "Mushroom Do Pyaza",
  "Gobi Do Pyaza",
  "Veg Keema Kasturi",
  "Sev Tamatar",
  "Veg Tak-a-Tak",
  "Jal Freeze",
  "Handi Veg",
  "Baby Corn Mushroom",
];

const NV_ENTREE_CHICKEN = [
  "Egg Curry",
  "Chicken Curry",
  "Chicken Saoji",
  "Chicken Haandi",
  "Butter Chicken",
  "Chicken Masala",
  "Karahi Chicken",
  "Garlic Chicken",
  "Chilli Chicken Gravy",
];

const NV_ENTREE_MUTTON = [
  "Karahi Mutton",
  "Mutton Saag Wala",
  "Mutton Masala",
  "Mutton Curry",
  "Mutton Saoji",
  "Mutton Rogan Josh",
  "Mutton Haandi",
  "Mutton Keema Mutter",
];

const NV_ENTREE_FISH = ["Fish Curry", "Fish Masala", "Kadhai Fish"];

const VEG_SOUPS = [
  "Cream of Tomato",
  "Cream of Veg",
  "Veg Hot & Sour",
  "Mix Veg Hot Garlic Sauce",
  "Minestrone Veg",
  "Cream of Mushroom",
  "Veg Lemon Coriander",
  "Tomato Pepper",
  "Sweet Corn Veg",
  "Tomato Dhaniya Shorba",
  "Laksa Veg Soup",
];

const NV_SOUPS = [
  "Plain Chicken Soup",
  "Chicken & Corn Soup",
  "Hot N Sour Chicken Soup",
  "Chicken Manchow Soup",
  "Plain Mutton Soup",
  "Mutton & Corn Soup",
  "Hot N Sour Mutton Soup",
  "Mutton Manchow Soup",
];

const VEG_RICE = [
  "Jeera Rice",
  "Peas Pulao",
  "Mix Veg Pulao",
  "Steamed Rice",
  "Gola Bhat / Meetha Bhat",
  "Jeera Mutter Rice",
  "Mutter Pulao",
  "Khichdi Masala",
  "Khichdi Moong Dal",
  "Masala Bhaat",
  "Kashmiri Pulao",
  "Lemon Rice",
  "Dal Khichdi",
  "Coconut Rice",
  "Tawa Pulao",
  "Curd Rice",
  "Fannas Biryani",
  "Paneer Pulao",
  "Paneer Biryani",
  "Chhola Biryani",
  "Rajma Chawal",
  "Rajma Biryani",
  "Hyderabadi Veg Biryani",
  "Garlic Jeera Rice",
];

const NV_RICE = ["Chicken Biryani", "Mutton Biryani", "Egg Fried Rice"];

const VEG_DAL = [
  "Yellow Dal Butter",
  "Dal Fry",
  "Dal Tadka",
  "Dal Palak",
  "Dal Makhni",
  "Mix Dal",
  "Dal Kolhapuri",
  "Dal Fry Butter",
  "Jeera Dal",
  "Lehsun Jeera Dal",
  "Dal Pachrangi",
];

const VEG_BREADS = [
  "Plain Roti (Fulka)",
  "Plain Puri",
  "Palak Puri",
  "Masala Puri",
  "Methi Puri",
  "Meethi Puri",
  "Roomali Roti",
  "Bhakar / Jowar Roti",
  "Tandoori Roti",
  "Tandoori Roti (Butter)",
  "Plain Naan / Butter Roti",
  "Kashmiri Naan",
  "Makke ki Roti",
  "Paneer Paratha",
  "Gobi Paratha",
  "Aloo Paratha",
  "Stuffed Paratha",
  "Meethi Paratha",
  "Palak Paratha",
  "Baby Paratha",
  "Tawa Paratha",
  "Laccha Paratha (Tawa)",
  "Matka (Lambi) Roti",
  "Stuffed Naan",
  "Baby Naan",
  "Paneer Naan",
  "Garlic Naan",
  "Meerut Paratha",
  "Stuffed Kulcha",
  "Paneer Kulcha",
  "Butter Naan",
];

const VEG_SWEETS = [
  "Gulab Jamun",
  "Kala Jam",
  "Kashmiri Jamuns",
  "Gaajar Halwa",
  "Moong Dal Halwa",
  "Aloo Sheera",
  "Jalebi",
  "Imarti",
  "Rabdi",
  "Cham-Cham",
  "Ras Gulla",
  "Motichur Laddu",
  "Besan Laddu",
  "Rava Laddu",
  "Besan Barfi",
  "Srikhand",
  "Khoa Jalebi",
  "Puran Poli",
  "Khoa Poli",
  "Basundi",
  "Chawal ki Kheer",
  "Ras Malai",
  "Angoori Ras Malai",
  "Kesar Badam Kheer",
  "Rabdi Jalebi",
  "Baalu Shahi",
  "Chhena Tarbuj",
  "Dil Jani",
  "Pineapple Jalebi",
  "Strawberry Jalebi",
  "Apple Jalebi",
  "Mawa Kachori",
  "Mawa Bati",
  "Mango Rabdi",
  "Tiranga Halwa",
  "Faluda Kulfi",
  "Pineapple Sheera",
  "Mango Sheera",
];

const VEG_DESSERTS = [
  "Ice Cream Vanilla",
  "Ice Cream Strawberry",
  "Ice Cream Pista",
  "Ice Cream Chocolate",
  "Ice Cream Butter Scotch",
  "Fruit Salad",
  "Fruit Custard",
  "Ice Gola",
  "Pineapple Pastry",
  "Chocolate Pastry",
  "Strawberry Pastry",
  "Butter Scotch Pastry",
  "Chocolate Brownie",
];

const VEG_CURD = [
  "Karhi Pakora",
  "Karhi (Simple)",
  "Dahi Bhalla",
  "Dahi Karanja",
  "Dahi Vada",
  "Plain Dahi",
  "Sweet Dahi",
  "Bundi Raita",
  "Butter Milk",
  "Pineapple Raita",
  "Mix Fruit Raita",
  "Mix Veg Raita",
  "Lassi",
];

const VEG_AACHAR = [
  "Mixed Pickle",
  "Mango Pickle",
  "Lemon Pickle",
  "Khatta Meetha Lemon",
  "Green Chillies Pickle",
  "Varhari Mirchi",
  "Thecha",
  "Chatni Sweet",
  "Chatni Pudina",
];

const VEG_PAKORAS = [
  "Onion Pakora",
  "Moong Pakora",
  "Aloo Bhajiya",
  "Mix Veg Pakora",
  "Mirchi Bhajiya",
  "Mini Aloo Bonda",
  "Mix Bhajiya",
];

const VEG_CHAAT = [
  "Paani Puri",
  "Sev Puri",
  "Bhel Puri",
  "Dahi Samosa",
  "Dahi Kachori",
  "Papdi Chaat",
  "Disco Samosa Chaat",
  "Aloo Chana Chaat",
  "Raj Kachori",
  "Tiranga Chaat",
  "Katori Chaat",
  "Dabeli",
  "Fruit Chaat",
  "Chinese Bhel",
  "Dal Paneer Ki Tikki",
];

const VEG_LIVE_STALLS = [
  "Masala Dosa",
  "Cheela Counter",
  "Pav Bhaaji",
  "Jhunka Bhaakar",
  "Ragda Patis",
  "Aloo Tikkis",
  "Lazeez Pasta",
  "Chola Bhatura",
  "Fruit Counter",
  "Paan Counter",
  "Juice Counter",
  "Mocktail Counter",
];

const VEG_LIVE_COUNTERS = [
  "Mixed Veg Momo",
  "Mushroom Momo",
  "Corn Cheese Momo",
  "Spicy Neutralia Momo",
  "Mongolian Noodles Counter",
  "Mongolian Rice Counter",
  "Penne Pasta",
  "Spaghetti Pasta",
  "Fusilli Pasta",
  "Kesar Badam Masala Milk",
];

const VEG_CHINESE = [
  "Veg Chowmein",
  "Hakka Noodles",
  "Schezwan Noodles",
  "Schezwan Fried Rice",
  "Veg Fried Rice",
  "Gravy Manchurian",
  "Garlic Chilly Noodles",
];

const VEG_CUISINE = [
  "Sarso Ka Saag with Makke Ki Roti",
  "Dal Makhani with Roomali Roti",
  "Kadai Paneer with Naan",
  "Amritsari Kulcha with Chole",
  "Amritsari Pakora",
  "Paneer Bhurji",
  "Rajma Chawal (Punjabi)",
  "Pindi Chana with Bhatura",
  "Punjabi Kadhi",
  "Dal Baati Churma",
  "Khasta Kachori",
  "Jaipuri Kadi Pakodi",
  "Jaipur Ke Golgappe",
  "Thepla with Dal / Kadi",
  "Khichdi with Kacche Papite Ki Subji",
  "Papite Ki Subji",
  "Fafda / Khaman / Khandvi / Khakhra",
  "Dosa / Idli / Vada",
  "Masala Dosa Counter",
  "Uttapam with Chutney",
  "Moong Dal Cheela with Green Chutney",
  "American Chopsuey",
  "Burnt Garlic Noodles",
  "Ginger Fried Rice",
  "Paneer Baby Corn",
  "Paneer Schezwan",
  "Crispy Baby Corn in Hot Sauce",
  "Crispy Paneer in Hot Sauce",
  "Crispy Veg",
  "Chilly Potato Dry",
  "Gobhi Matar Paratha",
  "Dal Ka Paratha",
  "Veg Paratha",
  "Pyaz Ka Paratha",
  "Muli Ka Paratha",
  "Cheese Paratha",
];

const VEG_SALAD = [
  "Green Salad",
  "Sprout Salad",
  "Koshimbir",
  "Khamang Kakdi Koshimbir",
  "Kanda Tomato",
  "Koshimbir Meethi Amba",
  "Cucumber Salad",
  "Russian Salad",
  "Corn & Capsicum",
  "Aloo Chana Chat",
  "Tossed Salad",
  "Three Treasure Salad",
  "Laccha Cabbage Salad",
  "Laccha Onion Salad",
];

const VEG_PAPAD = ["Fried Papad", "Roasted Papad", "Disco Papad", "Urad Papad"];

const VEG_BEVERAGES = [
  "Tea",
  "Masala Tea",
  "Black Tea with Lemon",
  "Coffee",
  "Assorted Soft Drinks",
  "Orange Blossom",
  "Mango Squash",
  "Pineapple Squash",
  "Pineapple Milkshake",
  "Jal Jeera",
  "Khus Drink",
  "Mango Paana",
  "Lemon Juice",
  "Banarasi Lassi",
];

const VEG_SHAKES = [
  "Strawberry Shake",
  "Chocolate Shake",
  "Khus Shake",
  "Mango Shake",
  "Orange Shake",
  "Pineapple Shake",
];

const VEG_MOCKTAILS = [
  "Fruit Punch",
  "Blue Lagoon",
  "Pina Colada",
  "Blue Current",
  "Lemon Mint",
  "Mojito",
  "Pudina Jal Jeera",
  "Masala Soda",
  "Pineapple Slush",
  "Fresh Lime Soda",
];

const CATEGORIES: MenuCategory[] = [
  {
    id: "starters",
    title: "Starters",
    blurb: "Appetisers served before the main buffet.",
    sections: [
      { label: "Non-Veg · Chicken", diet: "nonveg", items: NV_STARTERS_CHICKEN },
      { label: "Non-Veg · Mutton", diet: "nonveg", items: NV_STARTERS_MUTTON },
      { label: "Non-Veg · Fish", diet: "nonveg", items: NV_STARTERS_FISH },
      { label: "Veg", diet: "veg", items: VEG_STARTERS },
    ],
  },
  {
    id: "soups",
    title: "Soups",
    blurb: "Served hot at the start of the meal.",
    sections: [
      { label: "Non-Veg", diet: "nonveg", items: NV_SOUPS },
      { label: "Veg", diet: "veg", items: VEG_SOUPS },
    ],
  },
  {
    id: "main-course",
    title: "Main Course",
    blurb: "Gravies and curries for the buffet.",
    sections: [
      { label: "Non-Veg · Chicken", diet: "nonveg", items: NV_ENTREE_CHICKEN },
      { label: "Non-Veg · Mutton", diet: "nonveg", items: NV_ENTREE_MUTTON },
      { label: "Non-Veg · Fish", diet: "nonveg", items: NV_ENTREE_FISH },
      { label: "Veg · Paneer & rich gravies", diet: "veg", items: VEG_SPECIAL_ENTREE },
      { label: "Veg · Seasonal vegetables", diet: "veg", items: VEG_SEASONAL_ENTREE },
    ],
  },
  {
    id: "rice",
    title: "Rice & Biryani",
    blurb: "Pulaos, biryanis and everyday rice.",
    sections: [
      { label: "Non-Veg", diet: "nonveg", items: NV_RICE },
      { label: "Veg", diet: "veg", items: VEG_RICE },
    ],
  },
  {
    id: "dal",
    title: "Dal",
    blurb: "Lentils, from a simple tadka to dal makhni.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_DAL }],
  },
  {
    id: "breads",
    title: "Breads & Rotis",
    blurb: "Tawa rotis, tandoori breads, parathas and puris.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_BREADS }],
  },
  {
    id: "sweets",
    title: "Sweets",
    blurb: "Halwas, jamuns, jalebis and Bengali sweets.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_SWEETS }],
  },
  {
    id: "desserts",
    title: "Desserts",
    blurb: "Ice creams, pastries and cold desserts.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_DESSERTS }],
  },
  {
    id: "curd",
    title: "Curd Preparations",
    blurb: "Raitas, kadhis and chilled curd dishes.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_CURD }],
  },
  {
    id: "aachar",
    title: "Pickles & Chutneys",
    blurb: "Aachar and chutneys served alongside.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_AACHAR }],
  },
  {
    id: "pakoras",
    title: "Pakoras",
    blurb: "Fritters fried to order.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_PAKORAS }],
  },
  {
    id: "chaat",
    title: "Chaat",
    blurb: "Street-style chaat counters.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_CHAAT }],
  },
  {
    id: "live-stalls",
    title: "Live Stalls",
    blurb: "Cooked in front of your guests.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_LIVE_STALLS }],
  },
  {
    id: "live-counters",
    title: "Live Counters",
    blurb: "Momo, Mongolian, Italian and milk counters with a choice of sauces.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_LIVE_COUNTERS }],
  },
  {
    id: "chinese",
    title: "Chinese",
    blurb: "Indo-Chinese noodles and rice.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_CHINESE }],
  },
  {
    id: "cuisine-specials",
    title: "Cuisine Specials",
    blurb: "Regional counters — Punjabi, Jaipuri, Gujarati, South Indian and Agra parathas.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_CUISINE }],
  },
  {
    id: "salad",
    title: "Salads",
    blurb: "Koshimbir, kachumber and tossed salads.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_SALAD }],
  },
  {
    id: "papad",
    title: "Papad",
    blurb: "Fried or roasted, served with the meal.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_PAPAD }],
  },
  {
    id: "beverages",
    title: "Beverages",
    blurb: "Tea, coffee, squashes and cold drinks.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_BEVERAGES }],
  },
  {
    id: "shakes",
    title: "Shakes",
    blurb: "Thick milkshakes from the beverage counter.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_SHAKES }],
  },
  {
    id: "mocktails",
    title: "Mocktails",
    blurb: "Non-alcoholic mixes from the mocktail counter.",
    sections: [{ label: "Veg", diet: "veg", items: VEG_MOCKTAILS }],
  },
];

/**
 * Veg menus drop the meat and fish sections entirely; non-veg menus keep every
 * section with the non-veg ones listed first inside each category.
 */
export function categoriesFor(diet: Diet): MenuCategory[] {
  return CATEGORIES.map((category) => ({
    ...category,
    sections:
      diet === "veg"
        ? category.sections.filter((section) => section.diet === "veg")
        : [
            ...category.sections.filter((section) => section.diet === "nonveg"),
            ...category.sections.filter((section) => section.diet === "veg"),
          ],
  })).filter((category) => category.sections.length > 0);
}

export function categoryItems(category: MenuCategory): string[] {
  return category.sections.flatMap((section) => section.items);
}

export const ALL_CATEGORIES: MenuCategory[] = CATEGORIES;
