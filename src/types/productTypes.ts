export interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  has_discount: boolean;
  discount: number;
  category_id: number;
  provider_id: number;
  isOutlet?: boolean;
}

export type CartItem = ProductType & {
  quantity: number;
};
