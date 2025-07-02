export interface OrderType {
    product_id: number,
    quantity: number,
}

export interface OrderPost {
    items: OrderType[]
}