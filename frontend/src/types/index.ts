export interface AttributeItem {
  displayValue: string;
  value: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: string;
  items: AttributeItem[];
}

export interface Price {
  amount: number;
  currencyLabel: string;
  currencySymbol: string;
}

export interface Product {
  id: string;
  name: string;
  inStock: boolean;
  description: string;
  brand: string;
  type: string;
  gallery: string[];
  attributes: Attribute[];
  prices: Price[];
}

export interface Category {
  name: string;
}

export interface CartItem {
  product: Product;
  selectedAttributes: { [key: string]: string };
  quantity: number;
}
