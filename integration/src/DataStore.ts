import { IProduct, ICustomer, IOrder, IInvoice } from "./types";

// Classe de stockage de données (simule une base de données)
export class DataStore {
  private products: Map<string, IProduct> = new Map();
  private customers: Map<string, ICustomer> = new Map();
  private orders: Map<string, IOrder> = new Map();
  private invoices: Map<string, IInvoice> = new Map();

  // Méthodes pour les produits
  saveProduct(product: IProduct): void {
    this.products.set(product.id, product);
  }

  getProduct(id: string): IProduct | undefined {
    return this.products.get(id);
  }

  getAllProducts(): IProduct[] {
    return Array.from(this.products.values());
  }

  getAvailableProducts(): IProduct[] {
    return this.getAllProducts().filter(p => p.available);
  }

  // Méthodes pour les clients
  saveCustomer(customer: ICustomer): void {
    this.customers.set(customer.id, customer);
  }

  getCustomer(id: string): ICustomer | undefined {
    return this.customers.get(id);
  }

  // Méthodes pour les commandes
  saveOrder(order: IOrder): void {
    this.orders.set(order.id, order);
  }

  getOrder(id: string): IOrder | undefined {
    return this.orders.get(id);
  }

  getCustomerOrders(customerId: string): IOrder[] {
    return Array.from(this.orders.values()).filter(order => order.customerId === customerId);
  }

  // Méthodes pour les factures
  saveInvoice(invoice: IInvoice): void {
    this.invoices.set(invoice.id, invoice);
  }

  getInvoice(id: string): IInvoice | undefined {
    return this.invoices.get(id);
  }

  getOrderInvoice(orderId: string): IInvoice | undefined {
    return Array.from(this.invoices.values()).find(invoice => invoice.orderId === orderId);
  }
}
