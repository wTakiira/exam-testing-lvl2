import { DataStore } from "./DataStore";
import { OrderService } from "./OrderService";
import { IInvoice, PaymentMethod } from "./types";

export class InvoiceService {
  constructor(
    private dataStore: DataStore,
    private orderService: OrderService
  ) { }

  createInvoice(orderId: string): IInvoice | null {
    // Vérifier si la commande existe
    const order = this.orderService.getOrder(orderId);
    if (!order) return null;

    // Vérifier qu'il n'y a pas déjà une facture pour cette commande
    const existingInvoice = this.dataStore.getOrderInvoice(orderId);
    if (existingInvoice) return existingInvoice;

    // Calculer la TVA (10% pour simplifier)
    const taxRate = 0.1;
    const tax = order.totalAmount * taxRate;

    // Créer la facture
    const invoice: IInvoice = {
      id: `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      customerId: order.customerId,
      items: order.items,
      totalAmount: order.totalAmount,
      tax,
      paid: false,
      createdAt: new Date()
    };

    this.dataStore.saveInvoice(invoice);
    return invoice;
  }

  getInvoice(id: string): IInvoice | undefined {
    return this.dataStore.getInvoice(id);
  }

  payInvoice(id: string, paymentMethod: PaymentMethod): boolean {
    const invoice = this.dataStore.getInvoice(id);
    if (!invoice || invoice.paid) return false;

    invoice.paid = true;
    invoice.paymentMethod = paymentMethod;
    invoice.paidAt = new Date();

    this.dataStore.saveInvoice(invoice);
    return true;
  }

  getOrderInvoice(orderId: string): IInvoice | undefined {
    return this.dataStore.getOrderInvoice(orderId);
  }
}
