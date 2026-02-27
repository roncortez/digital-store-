// Order-related type definitions
export interface Order {
    id: number;
    user_id: number;
    order_number: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: string;
    delivery_method: DeliveryMethod;
    subtotal: number;
    discount: number;
    shipping_cost: number;
    total: number;
    delivery_address: DeliveryAddress | null;
    billing_info: BillingInfo | null;
    created_at: string;
    updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DeliveryMethod = 'pickup' | 'delivery';

export interface DeliveryAddress {
    address: string;
    city: string;
    phone?: string;
    notes?: string;
}

export interface BillingInfo {
    name: string;
    ruc: string;
    address: string;
    phone?: string;
    email?: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    product_price: number;
    product_image_url: string | null;
    quantity: number;
    subtotal: number;
}
