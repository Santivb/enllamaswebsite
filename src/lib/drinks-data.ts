export type DrinkItem = {
  name: string;
  description?: string;
  price?: string;
};

export type DrinkCategory = {
  id: string;
  title: string;
  note?: string;
  items: DrinkItem[];
};

// Sourced from En Llamas 87's own printed drinks menu (DrinksMenu.pdf).
export const drinkCategories: DrinkCategory[] = [
  {
    id: "non-alcoholic",
    title: "Non-Alcoholic",
    items: [
      { name: "Jarritos", price: "$4" },
      { name: "Coke, Sprite or Fanta", description: "Bottle", price: "$4" },
      { name: "Manzana Colombiana", price: "$4" },
      {
        name: "Can Soda",
        description: "Coke, Diet Coke, Sprite, Ginger Ale, Sunkist, Grape & more",
        price: "$2",
      },
      { name: "Bottled Water", price: "$2" },
    ],
  },
  {
    id: "juices",
    title: "Fruit Juices",
    note: "Made with water or milk",
    items: [
      { name: "Passion Fruit / Maracuyá", price: "$6" },
      { name: "Mango", price: "$6" },
      { name: "Blackberry / Mora", price: "$6" },
      { name: "Pineapple / Piña", price: "$6" },
      { name: "Lulo", price: "$6" },
      { name: "Soursop / Guanábana", price: "$6" },
    ],
  },
  {
    id: "coffee",
    title: "Coffee",
    items: [
      { name: "Small", price: "$2.50" },
      { name: "Large", price: "$3" },
    ],
  },
  {
    id: "wine-beer",
    title: "Wine & Beer",
    items: [
      { name: "Sangria", description: "Red or white" },
      { name: "Wines", description: "Selection of red and white wines available" },
      { name: "Beer", description: "Modelo, Corona, Heineken, Stella & more" },
    ],
  },
  {
    id: "signature-cocktails",
    title: "Signature Cocktails",
    items: [
      { name: "Maracuyá Verde", description: "Tequila blanco, passion fruit, lime, agave & milk, clarified" },
      { name: "Colombia Mule", description: "Aguardiente, lime, panela syrup & ginger beer" },
      { name: "Guayaba Spritz", description: "White rum, guava, lime, honey, soda & prosecco" },
      { name: "Piña & Coco Highball", description: "White rum, pineapple, coconut cream, lime & soda" },
      { name: "Mango Verde", description: "Mezcal, green mango, lime & sweet chile syrup" },
    ],
  },
  {
    id: "cocktails",
    title: "Cocktails",
    note: "Flavors: mango, pineapple, passionfruit, strawberry — also available virgin",
    items: [
      { name: "Margarita", description: "On the rocks or frozen" },
      { name: "Mojito" },
      { name: "Daiquiri" },
      { name: "Piña Colada" },
    ],
  },
];
