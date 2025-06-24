import { DataStore } from "./DataStore";
import { ICustomer } from "./types";

export class CustomerService {
  constructor(private dataStore: DataStore) { }

  createCustomer(customer: Omit<ICustomer, 'id' | 'loyaltyPoints'>): ICustomer {
    const newCustomer: ICustomer = {
      ...customer,
      id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      loyaltyPoints: 0
    };

    this.dataStore.saveCustomer(newCustomer);
    return newCustomer;
  }

  getCustomer(id: string): ICustomer | undefined {
    return this.dataStore.getCustomer(id);
  }

  addLoyaltyPoints(customerId: string, points: number): boolean {
    const customer = this.dataStore.getCustomer(customerId);
    if (!customer) return false;

    customer.loyaltyPoints += points;
    this.dataStore.saveCustomer(customer);
    return true;
  }
}
