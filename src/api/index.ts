import type { DashboardStats, ChartDataPoint, Order, Product, Customer, Category } from "@/types"
import {
  mockDashboardStats,
  mockRevenueData,
  mockCategoryData,
  mockOrders,
  mockProducts,
  mockCustomers,
  mockCategories,
} from "./mock-data"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let orders = [...mockOrders]
let products = [...mockProducts]
let customers = [...mockCustomers]
let categories = [...mockCategories]

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(500)
  return mockDashboardStats
}

export async function getRevenueData(): Promise<ChartDataPoint[]> {
  await delay(600)
  return mockRevenueData
}

export async function getCategoryData(): Promise<ChartDataPoint[]> {
  await delay(400)
  return mockCategoryData
}

export async function getOrders(): Promise<Order[]> {
  await delay(700)
  return [...orders]
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay(300)
  return orders.find((o) => o.id === id) || null
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  await delay(500)
  const index = orders.findIndex((o) => o.id === id)
  if (index === -1) throw new Error("Order not found")

  const updatedOrder: Order = { ...orders[index], status }
  orders = orders.map((o) => (o.id === id ? updatedOrder : o))
  return updatedOrder
}

export async function getProducts(): Promise<Product[]> {
  await delay(500)
  return [...products]
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(300)
  return products.find((p) => p.id === id) || null
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  await delay(800)
  const newProduct: Product = {
    ...data,
    id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
  }
  products = [newProduct, ...products]
  return newProduct
}

export async function updateProduct(id: string, data: Omit<Product, "id">): Promise<Product> {
  await delay(800)
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) throw new Error("Product not found")

  const updatedProduct: Product = { ...data, id }
  products = products.map((p) => (p.id === id ? updatedProduct : p))
  return updatedProduct
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(600)
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) throw new Error("Product not found")

  products = products.filter((p) => p.id !== id)
}

// Customer API
export async function getCustomers(): Promise<Customer[]> {
  await delay(500)
  return [...customers]
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  await delay(300)
  return customers.find((c) => c.id === id) || null
}

export async function createCustomer(data: Omit<Customer, "id">): Promise<Customer> {
  await delay(800)
  const newCustomer: Customer = {
    ...data,
    id: `CUS-${String(customers.length + 1).padStart(3, "0")}`,
  }
  customers = [newCustomer, ...customers]
  return newCustomer
}

export async function updateCustomer(id: string, data: Omit<Customer, "id">): Promise<Customer> {
  await delay(800)
  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Customer not found")

  const updatedCustomer: Customer = { ...data, id }
  customers = customers.map((c) => (c.id === id ? updatedCustomer : c))
  return updatedCustomer
}

export async function updateCustomerStatus(id: string, status: Customer["status"]): Promise<Customer> {
  await delay(500)
  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Customer not found")

  const updatedCustomer: Customer = { ...customers[index], status }
  customers = customers.map((c) => (c.id === id ? updatedCustomer : c))
  return updatedCustomer
}

export async function deleteCustomer(id: string): Promise<void> {
  await delay(600)
  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Customer not found")

  customers = customers.filter((c) => c.id !== id)
}

// Category API
export async function getCategories(): Promise<Category[]> {
  await delay(500)
  return [...categories]
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await delay(300)
  return categories.find((c) => c.id === id) || null
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  await delay(800)
  const newCategory: Category = {
    ...data,
    id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
  }
  categories = [newCategory, ...categories]
  return newCategory
}

export async function updateCategory(id: string, data: Omit<Category, "id">): Promise<Category> {
  await delay(800)
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Category not found")

  const updatedCategory: Category = { ...data, id }
  categories = categories.map((c) => (c.id === id ? updatedCategory : c))
  return updatedCategory
}

export async function updateCategoryStatus(id: string, status: Category["status"]): Promise<Category> {
  await delay(500)
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Category not found")

  const updatedCategory: Category = { ...categories[index], status }
  categories = categories.map((c) => (c.id === id ? updatedCategory : c))
  return updatedCategory
}

export async function deleteCategory(id: string): Promise<void> {
  await delay(600)
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Category not found")

  categories = categories.filter((c) => c.id !== id)
}
