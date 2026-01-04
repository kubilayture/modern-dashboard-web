import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { Plus, Search, X, ChevronDown } from "lucide-react"
import type { Product } from "@/types"
import { useGetProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductCard, ProductCardSkeleton } from "@/components/cards"
import { ProductsTable } from "./lists/products-table"
import { ProductFormDialog } from "./lists/product-form-dialog"
import { ProductDeleteDialog } from "./lists/product-delete-dialog"

const ITEMS_PER_PAGE = 6

export function ListsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: products = [], isPending } = useGetProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const [mobileSearch, setMobileSearch] = useState("")
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState<string>("all")
  const [mobileStatusFilter, setMobileStatusFilter] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = products

    if (mobileSearch) {
      const search = mobileSearch.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
      )
    }

    if (mobileCategoryFilter !== "all") {
      result = result.filter((product) => product.category === mobileCategoryFilter)
    }

    if (mobileStatusFilter !== "all") {
      result = result.filter((product) => product.status === mobileStatusFilter)
    }

    return result
  }, [products, mobileSearch, mobileCategoryFilter, mobileStatusFilter])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const handleAddClick = () => {
    setEditingProduct(null)
    setFormDialogOpen(true)
  }

  const handleViewClick = (product: Product) => {
    navigate(`/products/${product.id}`)
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data })
    } else {
      await createProduct.mutateAsync(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return
    await deleteProductMutation.mutateAsync(deletingProduct.id)
    setDeletingProduct(null)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleResetMobileFilters = () => {
    setMobileSearch("")
    setMobileCategoryFilter("all")
    setMobileStatusFilter("all")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const isMobileFiltered = mobileSearch !== "" || mobileCategoryFilter !== "all" || mobileStatusFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col justify-between space-y-2">
              <CardTitle>{t("products.title")}</CardTitle>
              <CardDescription>{t("products.description")}</CardDescription>
            </div>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 size-4" />
              {t("products.addProduct")}
            </Button>
          </CardHeader>
          <CardContent>
            <ProductsTable
              data={products}
              isLoading={isPending}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("products.title")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("products.description")}
            </p>
          </div>
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="mr-2 size-4" />
            {t("products.addProduct")}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={t("products.searchPlaceholder")}
              value={mobileSearch}
              onChange={(e) => {
                setMobileSearch(e.target.value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={mobileCategoryFilter}
              onValueChange={(value) => {
                setMobileCategoryFilter(value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("products.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={mobileStatusFilter}
              onValueChange={(value) => {
                setMobileStatusFilter(value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("products.allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.allStatus")}</SelectItem>
                <SelectItem value="in_stock">{t("products.inStock")}</SelectItem>
                <SelectItem value="low_stock">{t("products.lowStock")}</SelectItem>
                <SelectItem value="out_of_stock">{t("products.outOfStock")}</SelectItem>
              </SelectContent>
            </Select>

            {isMobileFiltered && (
              <Button variant="ghost" size="sm" onClick={handleResetMobileFilters}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {isPending ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("common.noResults")}
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {hasMore && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
              >
                {t("common.loadMore")}
                <ChevronDown className="ml-2 size-4" />
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {visibleProducts.length} / {filteredProducts.length}
            </p>
          </>
        )}
      </div>

      <ProductFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        categories={categories.length > 0 ? categories : ["Electronics", "Clothing", "Furniture", "Sports", "Books"]}
      />

      <ProductDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={deletingProduct}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
