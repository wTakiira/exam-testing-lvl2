// invoice.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { DataStore } from '../DataStore';
import { CustomerService } from '../CustomerService';
import { ProductService } from '../ProductService';
import { OrderService } from '../OrderService';
import { InvoiceService } from '../InvoiceService';

let dataStore: DataStore;
let customerService: CustomerService;
let productService: ProductService;
let orderService: OrderService;
let invoiceService: InvoiceService;

beforeEach(() => {
  dataStore = new DataStore();
  customerService = new CustomerService(dataStore);
  productService = new ProductService(dataStore);
  orderService = new OrderService(dataStore, productService, customerService);
  invoiceService = new InvoiceService(dataStore, orderService);
});

describe('Test d\'intégration : Commande et Facturation', () => {
  it('doit créer une facture pour une commande valide', () => {
    // 1. Créer un client
    const customer = customerService.createCustomer({
      name: 'Tommy Patachon',
      email: 'tommyp@monmail.com',
      phone: '0123456789',
      address: '123 rue de Paris'
    });

    // 2. Créer un produit
    const product = productService.createProduct({
      name: 'Pizza Margherita',
      description: 'Classique avec mozzarella',
      price: 12,
      category: 'main',
      available: true,
      preparationTimeMinutes: 15
    });

    // 3. Passer une commande
    const order = orderService.createOrder(customer.id, [
      { productId: product.id, quantity: 2 }
    ]);

    expect(order).not.toBeNull();
    expect(order?.totalAmount).toBe(24);

    // 4. Créer une facture
    const invoice = invoiceService.createInvoice(order!.id);

    expect(invoice).not.toBeNull();
    expect(invoice?.orderId).toBe(order!.id);
    expect(invoice?.tax).toBeCloseTo(2.4, 1); // 10% de TVA
    expect(invoice?.totalAmount).toBeCloseTo(26.4, 1);
  });

  it('ne doit pas créer de facture si la commande contient un produit non disponible', () => {
    const customer = customerService.createCustomer({
      name: 'Bernardo Rojas',
      email: 'bernroj@monmail.com',
      phone: '0987654321',
      address: '456 rue de Lyon'
    });

    const unavailableProduct = productService.createProduct({
      name: 'Burger Végétarien',
      description: 'Burger sans viande',
      price: 10,
      category: 'main',
      available: false,
      preparationTimeMinutes: 10
    });

    const order = orderService.createOrder(customer.id, [
      { productId: unavailableProduct.id, quantity: 1 }
    ]);

    expect(order).toBeNull();

    const invoice = invoiceService.createInvoice('commande-invalide');
    expect(invoice).toBeNull();
  });


});
