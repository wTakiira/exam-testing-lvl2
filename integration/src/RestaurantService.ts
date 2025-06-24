import { CustomerService } from "./CustomerService";
import { DataStore } from "./DataStore";
import { InvoiceService } from "./InvoiceService";
import { OrderService } from "./OrderService";
import { ProductService } from "./ProductService";
import { IOrder, IInvoice } from "./types";

export class RestaurantSystem {
  private dataStore: DataStore;
  private productService: ProductService;
  private customerService: CustomerService;
  private orderService: OrderService;
  private invoiceService: InvoiceService;

  constructor() {
    this.dataStore = new DataStore();
    this.productService = new ProductService(this.dataStore);
    this.customerService = new CustomerService(this.dataStore);
    this.orderService = new OrderService(this.dataStore, this.productService, this.customerService);
    this.invoiceService = new InvoiceService(this.dataStore, this.orderService);
  }

  // Expose les services pour utilisation
  getProductService(): ProductService {
    return this.productService;
  }

  getCustomerService(): CustomerService {
    return this.customerService;
  }

  getOrderService(): OrderService {
    return this.orderService;
  }

  getInvoiceService(): InvoiceService {
    return this.invoiceService;
  }

  // Méthode utilitaire pour créer une commande complète avec facturation
  processOrder(customerId: string, items: Array<{ productId: string, quantity: number, notes?: string }>): {
    order: IOrder | null;
    invoice: IInvoice | null;
  } {
    const order = this.orderService.createOrder(customerId, items);
    if (!order) {
      return { order: null, invoice: null };
    }

    const invoice = this.invoiceService.createInvoice(order.id);
    return { order, invoice };
  }
}
