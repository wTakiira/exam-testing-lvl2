import { CustomerService } from "./CustomerService";
import { DataStore } from "./DataStore";
import { ProductService } from "./ProductService";
import { IOrder, IOrderItem, OrderStatus } from "./types";

export class OrderService {
  constructor(
    private dataStore: DataStore,
    private productService: ProductService,
    private customerService: CustomerService
  ) { }

  createOrder(customerId: string, items: Array<{ productId: string, quantity: number, notes?: string }>): IOrder | null {
    // Vérifier que le client existe
    const customer = this.customerService.getCustomer(customerId);
    if (!customer) return null;

    // Vérifier que tous les produits existent et sont disponibles
    const orderItems: IOrderItem[] = [];
    let totalAmount = 0;
    let maxPrepTime = 0;

    for (const item of items) {
      const product = this.productService.getProduct(item.productId);

      if (!product || !product.available) {
        return null; // Produit non disponible ou inexistant
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        notes: item.notes
      });

      totalAmount += product.price * item.quantity;

      // Trouver le temps de préparation le plus long pour estimation
      if (product.preparationTimeMinutes > maxPrepTime) {
        maxPrepTime = product.preparationTimeMinutes;
      }
    }

    if (orderItems.length === 0) return null;

    // Créer la commande
    const now = new Date();
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + maxPrepTime + 15); // Temps de préparation + 15 min de livraison

    const order: IOrder = {
      id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      customerId,
      items: orderItems,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      estimatedDeliveryTime: estimatedDelivery,
      totalAmount
    };

    this.dataStore.saveOrder(order);

    // Ajouter des points de fidélité (1 point par 10€ dépensés)
    const loyaltyPointsEarned = Math.floor(totalAmount / 10);
    if (loyaltyPointsEarned > 0) {
      this.customerService.addLoyaltyPoints(customerId, loyaltyPointsEarned);
    }

    return order;
  }

  getOrder(id: string): IOrder | undefined {
    return this.dataStore.getOrder(id);
  }

  updateOrderStatus(id: string, status: OrderStatus): boolean {
    const order = this.dataStore.getOrder(id);
    if (!order) return false;

    order.status = status;
    order.updatedAt = new Date();
    this.dataStore.saveOrder(order);
    return true;
  }

  cancelOrder(id: string): boolean {
    const order = this.dataStore.getOrder(id);
    if (!order || order.status !== 'pending') return false;

    order.status = 'cancelled';
    order.updatedAt = new Date();
    this.dataStore.saveOrder(order);
    return true;
  }

  getCustomerOrders(customerId: string): IOrder[] {
    return this.dataStore.getCustomerOrders(customerId);
  }
}
