export interface ProductType {
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    has_discount: boolean,
    discount: number,
    provider_id: number,
    category_id: number
}