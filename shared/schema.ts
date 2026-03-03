import { pgTable, text, serial, integer, boolean, timestamp, numeric, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, seller, driver, admin
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  category: text("category"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  storeId: integer("store_id").notNull(),
  driverId: integer("driver_id"),
  status: text("status").notNull().default("pending"), // pending, accepted, picking_up, delivering, completed, cancelled
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryTracking = pgTable("delivery_tracking", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  driverId: integer("driver_id").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isActive: true })
  .extend({
    name: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
    email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
    phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل").optional().or(z.literal("")),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertDeliveryTrackingSchema = createInsertSchema(deliveryTracking).omit({ id: true, updatedAt: true });

export type User = typeof users.$inferSelect;
export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type DeliveryTracking = typeof deliveryTracking.$inferSelect;

export type CreateUserRequest = z.infer<typeof insertUserSchema>;
export type UpdateUserRequest = Partial<CreateUserRequest>;

export type CreateStoreRequest = z.infer<typeof insertStoreSchema>;
export type UpdateStoreRequest = Partial<CreateStoreRequest>;

export type CreateProductRequest = z.infer<typeof insertProductSchema>;
export type UpdateProductRequest = Partial<CreateProductRequest>;

export type CreateOrderRequest = z.infer<typeof insertOrderSchema>;
export type UpdateOrderRequest = Partial<CreateOrderRequest>;

export type UpdateDeliveryTrackingRequest = z.infer<typeof insertDeliveryTrackingSchema>;

// Auth requests
export const loginSchema = z.object({
  emailOrPhone: z.string(),
  password: z.string()
});
export type LoginRequest = z.infer<typeof loginSchema>;