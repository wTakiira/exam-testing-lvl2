export type ProductCategory = 'starter' | 'main' | 'dessert' | 'drink';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash' | 'credit_card' | 'online';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  available: boolean;
  preparationTimeMinutes: number;
}

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  loyaltyPoints: number;
}

export interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface IOrder {
  id: string;
  customerId: string;
  items: IOrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  totalAmount: number;
}

export interface IInvoice {
  id: string;
  orderId: string;
  customerId: string;
  items: IOrderItem[];
  totalAmount: number;
  tax: number;
  paymentMethod?: PaymentMethod;
  paid: boolean;
  createdAt: Date;
  paidAt?: Date;
}
