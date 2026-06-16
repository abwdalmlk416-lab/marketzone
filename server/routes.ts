import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes (Simulated for MVP without proper session/JWT setup yet)
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { emailOrPhone, password } = api.auth.login.input.parse(req.body);
      
      let user = await storage.getUserByEmail(emailOrPhone);
      if (!user) {
        user = await storage.getUserByPhone(emailOrPhone);
      }
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Save user to session
      (req.session as any).user = user;
      res.status(200).json({ user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      
      // Check if user already exists (only if email/phone provided)
      if (input.email) {
        const existingByEmail = await storage.getUserByEmail(input.email);
        if (existingByEmail) {
          return res.status(400).json({ message: "البريد الإلكتروني مسجل مسبقاً", field: "email" });
        }
      }
      
      if (input.phone) {
        const existingByPhone = await storage.getUserByPhone(input.phone);
        if (existingByPhone) {
          return res.status(400).json({ message: "رقم الهاتف مسجل مسبقاً", field: "phone" });
        }
      }
      
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth Me (Get current user)
  app.get(api.auth.me.path, async (req, res) => {
    const user = (req.session as any)?.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json(user);
  });

  // Auth Logout
  app.post(api.auth.logout.path, async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out" });
    });
  });

  // Stores
  app.get(api.stores.list.path, async (req, res) => {
    const stores = await storage.getStores();
    res.json(stores);
  });

  app.get(api.stores.get.path, async (req, res) => {
    const store = await storage.getStore(Number(req.params.id));
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  });

  app.post(api.stores.create.path, async (req, res) => {
    try {
      const input = api.stores.create.input.parse(req.body);
      const store = await storage.createStore(input);
      res.status(201).json(store);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.stores.updateStatus.path, async (req, res) => {
    try {
      const { status } = api.stores.updateStatus.input.parse(req.body);
      const store = await storage.updateStoreStatus(Number(req.params.id), status);
      res.json(store);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error" });
      }
      res.status(404).json({ message: "Store not found" });
    }
  });

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const products = await storage.getProducts(storeId);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      // Coerce numeric types correctly
      const product = await storage.createProduct({
        ...input,
        price: input.price.toString()
      });
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Orders
  app.get(api.orders.list.path, async (req, res) => {
    const role = req.query.role as string | undefined;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const orders = await storage.getOrders({ role, userId });
    res.json(orders);
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder({
        ...input,
        totalAmount: input.totalAmount.toString()
      });
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    try {
      const { status, driverId } = api.orders.updateStatus.input.parse(req.body);
      const order = await storage.updateOrderStatus(Number(req.params.id), status, driverId);
      res.json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error" });
      }
      res.status(404).json({ message: "Order not found" });
    }
  });

  // Delivery
  app.post(api.delivery.updateLocation.path, async (req, res) => {
    try {
      const input = api.delivery.updateLocation.input.parse(req.body);
      const tracking = await storage.updateDeliveryLocation(input);
      res.json(tracking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.delivery.getLocation.path, async (req, res) => {
    const tracking = await storage.getDeliveryLocation(Number(req.params.orderId));
    if (!tracking) return res.status(404).json({ message: "Tracking not found" });
    res.json(tracking);
  });

  // Analytics
  app.get(api.analytics.getStoreStats.path, async (req, res) => {
    const stats = await storage.getStoreStats(Number(req.params.id));
    res.json(stats);
  });

  app.get(api.analytics.getPlatformStats.path, async (req, res) => {
    const stats = await storage.getPlatformStats();
    res.json(stats);
  });

  // Ratings
  app.post("/api/ratings", async (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) return res.status(401).json({ message: "غير مصرح" });
      const rating = await storage.createRating({ ...req.body, customerId: user.id });
      res.status(201).json(rating);
    } catch (err) {
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  app.get("/api/ratings", async (req, res) => {
    const productId = req.query.productId ? Number(req.query.productId) : undefined;
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const ratingsList = await storage.getRatings({ productId, storeId });
    res.json(ratingsList);
  });

  app.get("/api/ratings/avg", async (req, res) => {
    const productId = req.query.productId ? Number(req.query.productId) : undefined;
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const average = await storage.getAverageRating({ productId, storeId });
    res.json({ average });
  });

  // Coupons
  app.post("/api/coupons", async (req, res) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || (user.role !== "seller" && user.role !== "admin")) {
        return res.status(403).json({ message: "غير مصرح" });
      }
      const couponData = { ...req.body, code: req.body.code?.toUpperCase() };
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (err: any) {
      if (err?.code === "23505") {
        return res.status(400).json({ message: "الكود مستخدم مسبقاً" });
      }
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  app.get("/api/coupons/validate/:code", async (req, res) => {
    const coupon = await storage.getCouponByCode(req.params.code);
    if (!coupon) return res.status(404).json({ message: "الكوبون غير موجود" });
    if (!coupon.isActive) return res.status(400).json({ message: "الكوبون غير نشط" });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "انتهت صلاحية الكوبون" });
    }
    if (coupon.usageCount !== null && coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "تم استنفاد استخدامات الكوبون" });
    }
    res.json(coupon);
  });

  app.get("/api/coupons", async (req, res) => {
    const user = (req.session as any)?.user;
    if (!user) return res.status(401).json({ message: "غير مصرح" });
    const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
    const couponsList = await storage.getCoupons(storeId);
    res.json(couponsList);
  });

  // Seed DB Function
  async function seedDatabase() {
    try {
      const storesList = await storage.getStores();
      if (storesList.length === 0) {
        // Create Admin
        await storage.createUser({ name: "Admin", email: "admin@marketzone.com", password: "password", role: "admin" });
        
        // Create a Seller and Store
        const seller = await storage.createUser({ name: "Fallujah Electronics", email: "seller@marketzone.com", password: "password", role: "seller" });
        const store = await storage.createStore({ sellerId: seller.id, name: "Fallujah Electronics Store", description: "Best electronics in Fallujah", status: "approved" });
        
        // Create Products
        await storage.createProduct({ storeId: store.id, name: "iPhone 15 Pro", description: "Latest Apple phone", price: "999.00", stock: 10, category: "Electronics" });
        await storage.createProduct({ storeId: store.id, name: "Samsung Galaxy S24", description: "Latest Samsung phone", price: "899.00", stock: 15, category: "Electronics" });
        
        // Create Customer
        await storage.createUser({ name: "Ahmed", email: "ahmed@example.com", password: "password", role: "customer" });
        
        // Create Driver
        await storage.createUser({ name: "Ali Driver", email: "driver@marketzone.com", password: "password", role: "driver" });
        
        console.log("Database seeded successfully.");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // Call seed function
  seedDatabase();

  return httpServer;
}