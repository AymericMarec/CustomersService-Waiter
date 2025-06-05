export type Order = {
  type: string;
  order: Dish[];
  tableNumber: number;
};

type Dish = {
  name: string;
  description: string;
  quantity: number;
}