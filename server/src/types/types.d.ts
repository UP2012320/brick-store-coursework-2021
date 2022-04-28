export interface BrickColours {
  colour_hex: string;
  colour_id: number;
  colour_name: string;
}

export interface BrickTypes {
  type_id: number;
  type_name: string;
}

export interface Inventory {
  colour?: number;
  dateAdded: Date;
  description: string;
  discount?: number;
  inventoryId: string;
  itemName: string;
  price: number;
  slug: string;
  stock: number;
  type?: number;
  visible?: boolean;
}

export interface InventoryImages {
  imageId: string;
  inventoryId: string;
}

export interface Images {
  id: string;
}
