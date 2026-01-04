import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { useTranslation } from "react-i18next"
import { ArrowLeft, FolderTree, Package, Pencil, Trash2, Power, PowerOff } from "lucide-react"
import type { Category, Product } from "@/types"
import { useGetCategoryById, useUpdateCategory, useUpdateCategoryStatus, useDeleteCategory, useGetProducts } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { CategoryFormDialog } from "./categories/category-form-dialog"
import { CategoryDeleteDialog } from "./categories/category-delete-dialog"

const statusStyles: Record<Category["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const productStatusStyles: Record<Product["status"], string> = {
  in_stock: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  low_stock: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function CategoryDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: category, isPending } = useGetCategoryById(id)
  const { data: allProducts = [] } = useGetProducts()
  const updateCategory = useUpdateCategory()
  const updateCategoryStatus = useUpdateCategoryStatus()
  const deleteCategoryMutation = useDeleteCategory()

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const categoryProducts = allProducts.filter((product) => product.category === category?.name)

  const statusLabels: Record<Category["status"], string> = {
    active: t("categories.active"),
    inactive: t("categories.inactive"),
  }

  const productStatusLabels: Record<Product["status"], string> = {
    in_stock: t("products.inStock"),
    low_stock: t("products.lowStock"),
    out_of_stock: t("products.outOfStock"),
  }

  const handleFormSubmit = async (data: Omit<Category, "id">) => {
    if (!category) return
    await updateCategory.mutateAsync({ id: category.id, data })
  }

  const handleDeleteConfirm = async () => {
    if (!category) return
    await deleteCategoryMutation.mutateAsync(category.id)
    navigate("/categories")
  }

  const handleToggleStatus = async () => {
    if (!category) return
    const newStatus = category.status === "active" ? "inactive" : "active"
    await updateCategoryStatus.mutateAsync({ id: category.id, status: newStatus })
  }

  if (isPending) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <FolderTree className="size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{t("categories.notFound")}</h2>
        <Button variant="outline" onClick={() => navigate("/categories")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("categories.backToCategories")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/categories")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("categories.backToCategories")}
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" onClick={handleToggleStatus}>
            {category.status === "active" ? (
              <>
                <PowerOff className="mr-2 size-4" />
                {t("categories.deactivateCategory")}
              </>
            ) : (
              <>
                <Power className="mr-2 size-4" />
                {t("categories.activateCategory")}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setFormDialogOpen(true)}>
            <Pencil className="mr-2 size-4" />
            {t("common.edit")}
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 size-4" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {category.image && (
          <div className="md:col-span-1">
            <div className="aspect-4/3 overflow-hidden rounded-lg bg-muted">
              <img src={category.image} alt={category.name} className="size-full object-cover" />
            </div>
          </div>
        )}
        <div className={cn("space-y-4", category.image ? "md:col-span-2" : "md:col-span-3")}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <Badge variant="outline" className={cn("border-0", statusStyles[category.status])}>
                {statusLabels[category.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground font-mono text-sm">{category.slug}</p>
          </div>
          {category.description && (
            <p className="text-muted-foreground leading-relaxed">{category.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Package className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{t("categories.productCount")}:</span>
            <span className="font-semibold">{categoryProducts.length}</span>
          </div>
        </div>
      </div>

      <div className="sm:hidden flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleToggleStatus}>
          {category.status === "active" ? (
            <>
              <PowerOff className="mr-2 size-4" />
              {t("categories.deactivateCategory")}
            </>
          ) : (
            <>
              <Power className="mr-2 size-4" />
              {t("categories.activateCategory")}
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setFormDialogOpen(true)}>
          <Pencil className="mr-2 size-4" />
          {t("common.edit")}
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="mr-2 size-4" />
          {t("common.delete")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="size-4" />
            {t("categories.productsInCategory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryProducts.length > 0 ? (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("products.productId")}</TableHead>
                      <TableHead>{t("products.productName")}</TableHead>
                      <TableHead>{t("products.price")}</TableHead>
                      <TableHead>{t("products.stockColumn")}</TableHead>
                      <TableHead>{t("products.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Link
                            to={`/products/${product.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {product.id}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: product.currency,
                          }).format(product.price)}
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("border-0", productStatusStyles[product.status])}>
                            {productStatusLabels[product.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {categoryProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="block"
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {product.images?.[0] && (
                            <div className="size-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="size-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium truncate">{product.name}</p>
                              <Badge variant="outline" className={cn("border-0 text-xs flex-shrink-0", productStatusStyles[product.status])}>
                                {productStatusLabels[product.status]}
                              </Badge>
                            </div>
                            <p className="text-sm font-semibold">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: product.currency,
                              }).format(product.price)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("products.stock", { count: product.stock })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="size-12 mb-2 opacity-50" />
              <p>{t("categories.noProducts")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        category={category}
        onSubmit={handleFormSubmit}
      />

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={category}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
