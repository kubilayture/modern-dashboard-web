export interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalCustomers: number
  customersChange: number
  conversionRate: number
  conversionChange: number
}

export interface ChartDataPoint {
  name: string
  value: number
  value2?: number
  [key: string]: string | number | undefined
}

export interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: "pending" | "processing" | "completed" | "cancelled"
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar?: string
  joinedAt: string
}

export type Currency = "USD" | "EUR" | "TRY" | "GBP"

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  currency: Currency
  stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
  images: string[]
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "banned"
  totalOrders: number
  totalSpent: number
  createdAt: string
  avatar?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  status: "active" | "inactive"
  image?: string
}
