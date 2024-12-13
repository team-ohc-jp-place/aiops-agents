import { pgTable, text, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const pets = pgTable("pets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed").notNull(),
  age: integer("age").notNull(),
  price: decimal("price").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  total: decimal("total").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id").references(() => orders.id),
  petId: integer("pet_id").references(() => pets.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertPetSchema = createInsertSchema(pets);
export const selectPetSchema = createSelectSchema(pets);
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Pet = z.infer<typeof selectPetSchema>;

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = z.infer<typeof selectOrderSchema>;

export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = z.infer<typeof selectOrderItemSchema>;
