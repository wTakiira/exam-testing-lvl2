import { DataStore } from "./DataStore";
import { IProduct, ProductCategory } from "./types";

export class ProductService {
  constructor(private dataStore: DataStore) { }

  createProduct(product: Omit<IProduct, 'id'>): IProduct {
    const newProduct: IProduct = {
      ...product,
      id: `product_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };

    this.dataStore.saveProduct(newProduct);
    return newProduct;
  }

  getProduct(id: string): IProduct | undefined {
    return this.dataStore.getProduct(id);
  }

  updateProductAvailability(id: string, available: boolean): boolean {
    const product = this.dataStore.getProduct(id);
    if (!product) return false;

    product.available = available;
    this.dataStore.saveProduct(product);
    return true;
  }

  getAvailableProducts(): IProduct[] {
    return this.dataStore.getAvailableProducts();
  }

  getProductsByCategory(category: ProductCategory): IProduct[] {
    return this.dataStore.getAllProducts().filter(product => product.category === category);
  }
}
