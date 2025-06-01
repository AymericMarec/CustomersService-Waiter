export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  picture: string;
  type: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  comments: string;
}

export interface Menu{
  Dish:MenuItem[];
  Starter:MenuItem[];
  Dessert:MenuItem[];
  Drink:MenuItem[];
  Aperitif:MenuItem[];
}