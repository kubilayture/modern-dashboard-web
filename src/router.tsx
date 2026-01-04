import { createBrowserRouter } from "react-router"
import { AuthLayout, DashboardLayout } from "@/layouts"
import { ProtectedRoute } from "@/components/auth"
import {
  LoginPage,
  DashboardPage,
  DataTablePage,
  ListsPage,
  ProductDetailPage,
  OrderDetailPage,
  CustomersPage,
  CustomerDetailPage,
  CategoriesPage,
  CategoryDetailPage,
  ProfilePage,
  SettingsPage,
} from "@/pages"

function ProtectedDashboard({ titleKey }: { titleKey: string }) {
  return (
    <ProtectedRoute>
      <DashboardLayout titleKey={titleKey} />
    </ProtectedRoute>
  )
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="dashboard.title" />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="orders.title" />,
    children: [
      {
        path: "/orders",
        element: <DataTablePage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="orders.orderDetail" />,
    children: [
      {
        path: "/orders/:id",
        element: <OrderDetailPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="products.title" />,
    children: [
      {
        path: "/products",
        element: <ListsPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="products.productDetail" />,
    children: [
      {
        path: "/products/:id",
        element: <ProductDetailPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="customers.title" />,
    children: [
      {
        path: "/customers",
        element: <CustomersPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="customers.customerDetail" />,
    children: [
      {
        path: "/customers/:id",
        element: <CustomerDetailPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="categories.title" />,
    children: [
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="categories.categoryDetail" />,
    children: [
      {
        path: "/categories/:id",
        element: <CategoryDetailPage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="profile.title" />,
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    element: <ProtectedDashboard titleKey="settings.title" />,
    children: [
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
])
