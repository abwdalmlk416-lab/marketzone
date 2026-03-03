import { db } from "./db";
import { 
  users, stores, products, orders, deliveryTracking,
  type User, type Store, type Product, type Order, type DeliveryTracking,
  type CreateUserRequest, type UpdateUserRequest,
  type CreateStoreRequest, type UpdateStoreRequest,
  type CreateProductRequest, type UpdateProductRequest,
  type CreateOrderRequest, type UpdateOrderRequest,
  type UpdateDeliveryTrackingRequest
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: CreateUserRequest): Promise<User>;

  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  getStoreBySellerId(sellerId: number): Promise<Store | undefined>;
  createStore(store: CreateStoreRequest): Promise<Store>;
  updateStoreStatus(id: number, status: string): Promise<Store>;

  // Products
  getProducts(storeId?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: CreateProductRequest): Promise<Product>;
  updateProduct(id: number, product: UpdateProductRequest): Promise<Product>;

  // Orders
  getOrders(params?: { role?: string, userId?: number }): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: CreateOrderRequest): Promise<Order>;
  updateOrderStatus(id: number, status: string, driverId?: number): Promise<Order>;

  // Delivery
  updateDeliveryLocation(tracking: UpdateDeliveryTrackingRequest): Promise<DeliveryTracking>;
  getDeliveryLocation(orderId: number): Promise<DeliveryTracking | undefined>;

  // Analytics
  getStoreStats(storeId: number): Promise<{ totalOrders: number, totalRevenue: number }>;
  getPlatformStats(): Promise<{ totalStores: number, pendingStores: number, totalOrders: number, totalRevenue: number }>;
}

export class DatabaseStorage implements IStorage {
  // Auth
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }

  async getStoreBySellerId(sellerId: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.sellerId, sellerId));
    return store;
  }

  async createStore(store: CreateStoreRequest): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store).returning();
    return newStore;
  }

  async updateStoreStatus(id: number, status: string): Promise<Store> {
    const [updatedStore] = await db.update(stores)
      .set({ status })
      .where(eq(stores.id, id))
      .returning();
    return updatedStore;
  }

  // Products
  async getProducts(storeId?: number): Promise<Product[]> {
    if (storeId) {
      return await db.select().from(products).where(eq(products.storeId, storeId));
    }
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updateData: UpdateProductRequest): Promise<Product> {
    const [updatedProduct] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Orders
  async getOrders(params?: { role?: string, userId?: number }): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (params?.userId) {
      if (params.role === 'customer') {
        return await db.select().from(orders).where(eq(orders.customerId, params.userId));
      } else if (params.role === 'seller') {
        const store = await this.getStoreBySellerId(params.userId);
        if (store) {
          return await db.select().from(orders).where(eq(orders.storeId, store.id));
        }
        return [];
      } else if (params.role === 'driver') {
        return await db.select().from(orders).where(eq(orders.driverId, params.userId));
      }
    }
    
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: CreateOrderRequest): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string, driverId?: number): Promise<Order> {
    const updateData: any = { status };
    if (driverId) updateData.driverId = driverId;
    
    const [updatedOrder] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Delivery
  async updateDeliveryLocation(tracking: UpdateDeliveryTrackingRequest): Promise<DeliveryTracking> {
    // Upsert tracking info
    const existing = await this.getDeliveryLocation(tracking.orderId);
    if (existing) {
      const [updated] = await db.update(deliveryTracking)
        .set({ latitude: tracking.latitude, longitude: tracking.longitude, updatedAt: new Date() })
        .where(eq(deliveryTracking.orderId, tracking.orderId))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(deliveryTracking)
        .values(tracking)
        .returning();
      return inserted;
    }
  }

  async getDeliveryLocation(orderId: number): Promise<DeliveryTracking | undefined> {
    const [tracking] = await db.select().from(deliveryTracking).where(eq(deliveryTracking.orderId, orderId));
    return tracking;
  }

  // Analytics
  async getStoreStats(storeId: number): Promise<{ totalOrders: number, totalRevenue: number }> {
    const storeOrders = await db.select().from(orders).where(eq(orders.storeId, storeId));
    const totalOrders = storeOrders.length;
    const totalRevenue = storeOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount as string), 0);
    return { totalOrders, totalRevenue };
  }

  async getPlatformStats(): Promise<{ totalStores: number, pendingStores: number, totalOrders: number, totalRevenue: number }> {
    const allStores = await db.select().from(stores);
    const allOrders = await db.select().from(orders);
    
    const totalStores = allStores.length;
    const pendingStores = allStores.filter(s => s.status === 'pending').length;
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount as string), 0);
    
    return { totalStores, pendingStores, totalOrders, totalRevenue };
  }
}

export const storage = new DatabaseStorage();
