export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
};

/** A priced group of protein/style options, e.g. Tacos: "Chicken • Carnitas..." $5 each. */
export type VariantGroup = {
  items: string[];
  price: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  items?: MenuItem[];
  variantGroups?: VariantGroup[];
};

// Sourced from En Llamas 87's own printed menu (Enllamasmenu.pdf).
export const menuCategories: MenuCategory[] = [
  {
    id: "tapas",
    title: "Tapas",
    items: [
      { name: "Homemade Guacamole & Chips", description: "Made fresh in house", price: "$14" },
      { name: "Tostones with Guacamole", description: "Twice-fried green plantains", price: "$14" },
      { name: "Chicken Wings (6)", description: "Tossed in your choice of sauce", price: "$10" },
      { name: "Chicharrón", description: "Crispy fried pork belly", price: "$12" },
      { name: "Mozzarella Sticks (6)", description: "Breaded and fried until golden", price: "$9" },
      { name: "Pupusas (2)", description: "Stuffed corn cakes with cheese & beans", price: "$8" },
      { name: "Gambas", description: "Shrimp in garlic sauce or grilled", price: "$16" },
      { name: "Arepas con Queso", description: "Grilled corn cakes stuffed with melted cheese", price: "$16" },
      { name: "Sliders (3)", description: "Three mini burgers", price: "$16" },
      { name: "Fried Calamari", description: "Lightly fried, tangy dipping sauce", price: "$16" },
      { name: "Chicken Flautas / Taquitos", description: "Rolled and fried until crispy", price: "$16" },
      { name: "Empanadas (3)", description: "Choice of beef, chicken, potato or cheese", price: "$10" },
      { name: "Shrimp Empanada", price: "$5" },
      { name: "Chorizo", description: "Grilled Mexican sausage", price: "$8" },
      { name: "Grilled Octopus", description: "Charred over the grill", price: "$20" },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    items: [
      {
        name: "House Salad",
        description:
          "Lettuce, pico de gallo, cheese, sour cream & choice of dressing. Add steak or shrimp +$8, add chicken +$6",
        price: "$10",
      },
    ],
  },
  {
    id: "picada",
    title: "Picada",
    note: "For the table · Serves 2",
    items: [
      {
        name: "Assorted Meats",
        description: "Steak, chicken, chicharrón & chorizo, with yuca, plantain and potatoes",
        price: "$30",
      },
    ],
  },
  {
    id: "dips",
    title: "Dips",
    note: "Add Chips +$2",
    items: [
      { name: "Guacamole", description: "8oz. Also available 16oz (1lb) $20", price: "$10" },
      { name: "Mango Salsa", description: "8oz. Also available 16oz (1lb) $20", price: "$10" },
      { name: "Queso", description: "8oz", price: "$10" },
      { name: "House Salsa (Red or Green)", description: "8oz", price: "$10" },
    ],
  },
  {
    id: "nachos",
    title: "Nachos",
    note: "Melted cheese, beans, pico de gallo, sour cream, jalapeños & guacamole. Add Maduros (Dulce) +$2",
    variantGroups: [
      { items: ["Chicken", "Chorizo", "Carnitas", "Veggie", "Buffalo Chicken"], price: "$14.50" },
      { items: ["Asada", "Shrimp", "Birria", "Fish"], price: "$16" },
    ],
  },
  {
    id: "main-course",
    title: "Main Course",
    note: "All main dishes come with rice and salad",
    items: [
      { name: "Fajitas", description: "Chicken. Steak, shrimp or combo +$3", price: "$25" },
      { name: "Enchiladas", description: "Chicken or cheese", price: "$25" },
      { name: "Steak Ranchero", description: "Topped with ranchero sauce", price: "$28" },
      { name: "Lomo Saltado", description: "Stir-fried beef, onion & tomato", price: "$30" },
    ],
  },
  {
    id: "asados",
    title: "Asados",
    note: "From the Grill",
    items: [
      {
        name: "Parrillada",
        description: "Mixed grill platter, chef's selection of grilled meats. For 1 person $30, for 2 people $55",
        price: "$30 / $55",
      },
      { name: "Carne Asada", description: "Grilled or milanesa style, also available con arepa", price: "$26" },
      { name: "Picanha", description: "Grilled top sirloin cap", price: "$30" },
      { name: "Entraña", description: "Grilled skirt steak", price: "$30" },
      { name: "Salmón", description: "Grilled salmon filet", price: "$25" },
      { name: "Pechuga de Pollo", description: "Grilled or milanesa style", price: "$24" },
    ],
  },
  {
    id: "sides",
    title: "Extra Sides",
    items: [
      { name: "Rice", price: "$6" },
      { name: "Beans", price: "$6" },
      { name: "Tostones", price: "$6" },
      { name: "Fries", price: "$6" },
      { name: "Sweet Plantains (Maduros)", price: "$6" },
      { name: "Yuca", price: "$6" },
    ],
  },
  {
    id: "tacos",
    title: "Tacos",
    note: "Onions, cilantro, guacamole & salsa. Served in soft corn tortillas, with soft flour or hard corn also available",
    variantGroups: [
      { items: ["Chicken", "Carnitas", "Chorizo", "Pastor", "Veggie"], price: "$5 each" },
      { items: ["Asada", "Shrimp", "Birria", "Octopus", "Fish"], price: "$6 each" },
    ],
  },
  {
    id: "quesadillas",
    title: "Quesadillas",
    note: "Melted cheese folded in a flour tortilla. Add Maduros (Dulce) +$2",
    variantGroups: [
      { items: ["Chicken", "Chorizo", "Carnitas", "Veggie", "Buffalo Chicken"], price: "$14.50" },
      { items: ["Asada", "Shrimp", "Birria", "Fish"], price: "$16" },
    ],
  },
  {
    id: "tortas",
    title: "Tortas",
    note: "Toasted bread, lettuce, refried beans, tomato, melted cheese, jalapeños & avocado",
    variantGroups: [
      { items: ["Chicken", "Veggie"], price: "$15" },
      { items: ["Asada", "Shrimp"], price: "$16" },
    ],
  },
  {
    id: "burritos",
    title: "Burritos, Burrito Bowls & Taco Salads",
    note: "Rice, beans, pico, lettuce, cheese, sour cream & guacamole. Add Maduros (Dulce) +$2",
    variantGroups: [
      { items: ["Chicken", "Chorizo", "Carnitas", "Veggie", "Buffalo Chicken"], price: "$14.50" },
      { items: ["Asada", "Shrimp", "Birria", "Fish"], price: "$16" },
    ],
  },
  {
    id: "dessert",
    title: "Dessert",
    items: [
      { name: "Tres Leches Cake", price: "$8" },
      { name: "Flan", price: "$8" },
      { name: "Churro", price: "$4" },
    ],
  },
  {
    id: "kids",
    title: "Kids",
    note: "Add fries to any item +$3",
    items: [
      { name: "Quesadilla, Cheese", price: "$8" },
      { name: "Quesadilla, Chicken or Steak", price: "$10" },
      { name: "Chicken Tenders", price: "$10" },
    ],
  },
];

export type FeaturedDish = {
  name: string;
  description: string;
  tag: string;
  // Real dish photo, when available — falls back to the placeholder
  // ember-gradient treatment (see .dish-card in globals.css) when omitted.
  image?: string;
};

export const featuredDishes: FeaturedDish[] = [
  {
    name: "Parrillada",
    description: "Chef's selection, straight off the grill",
    tag: "For the Table",
    image: "/assets/food/parrillada.jpg",
  },
  {
    name: "Homemade Guacamole",
    description: "Made fresh in house, served as a side",
    tag: "Tapas",
    image: "/assets/food/guacamole.jpg",
  },
  {
    name: "Chicharrón",
    description: "Crispy fried pork belly, cilantro-lime dip",
    tag: "Tapas",
    image: "/assets/food/chicharron.jpg",
  },
  {
    name: "Chicken Flautas",
    description: "Rolled and fried until crispy",
    tag: "Tapas",
    image: "/assets/food/flautas.jpg",
  },
  {
    name: "Nachos",
    description: "Melted cheese, beans, pico de gallo & guacamole",
    tag: "Nachos",
    image: "/assets/food/nachos.jpg",
  },
  {
    name: "Tacos",
    description: "Onions, cilantro, guacamole & salsa",
    tag: "Tacos",
    image: "/assets/food/tacos.jpg",
  },
  {
    name: "Fajitas",
    description: "Sizzling chicken, steak & shrimp, onions & peppers",
    tag: "Main Course",
    image: "/assets/food/fajitas.jpg",
  },
  {
    name: "Enchiladas",
    description: "Chicken or cheese, oven-melted",
    tag: "Main Course",
    image: "/assets/food/enchiladas.jpg",
  },
  {
    name: "Tortas",
    description: "Toasted bread, melted cheese, avocado & jalapeños",
    tag: "Tortas",
    image: "/assets/food/tortas.jpg",
  },
  {
    name: "Burrito Bowls",
    description: "Rice, beans, pico, cheese & guacamole",
    tag: "Burritos",
    image: "/assets/food/burrito-bowls.jpg",
  },
  {
    name: "Tres Leches Cake",
    description: "Soaked in three milks, whipped topping",
    tag: "Dessert",
    image: "/assets/food/tres-leches.jpg",
  },
  {
    name: "Flan",
    description: "Silky caramel custard",
    tag: "Dessert",
    image: "/assets/food/flan.jpg",
  },
];

/**
 * The subset shown under "Signature Dishes" on the homepage.
 *
 * All twelve used to appear there, which is not a recommendation — it is the
 * menu again, and it leaves the visitor doing the same choosing they came to
 * the homepage to avoid. Six is a spread rather than a list: the grill
 * centrepiece, a main, a taco, a tapa, a shareable and a dessert. It also
 * fills the 2-up and 3-up grids exactly, with no odd card left on its own.
 *
 * To change what the homepage pushes, edit these names — anything listed here
 * must match a `name` in featuredDishes above.
 */
const HOMEPAGE_DISH_NAMES = [
  "Parrillada",
  "Fajitas",
  "Tacos",
  "Chicharrón",
  "Nachos",
  "Tres Leches Cake",
];

export const homepageDishes: FeaturedDish[] = HOMEPAGE_DISH_NAMES.map((name) => {
  const dish = featuredDishes.find((d) => d.name === name);
  if (!dish) {
    throw new Error(
      `HOMEPAGE_DISH_NAMES lists "${name}", which is not in featuredDishes.`
    );
  }
  return dish;
});

// Re-exported for backward compatibility — the single source of truth for
// all business info now lives in src/config/business.ts.
export { businessConfig as siteConfig } from "@/config/business";
