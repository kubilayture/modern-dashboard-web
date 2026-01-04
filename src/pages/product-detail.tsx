import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Package, Pencil, Trash2 } from "lucide-react"
import type { Product } from "@/types"
import { useGetProductById, useUpdateProduct, useDeleteProduct } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { ProductFormDialog } from "./lists/product-form-dialog"
import { ProductDeleteDialog } from "./lists/product-delete-dialog"

const statusStyles: Record<Product["status"], string> = {
  in_stock: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  low_stock: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isPending } = useGetProductById(id)
  const updateProduct = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (!api) return
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap())
    })
  }, [api])

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index)
  }

  const handleEditClick = () => {
    setFormDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    if (!product) return
    await updateProduct.mutateAsync({ id: product.id, data })
  }

  const handleDeleteConfirm = async () => {
    if (!product) return
    await deleteProductMutation.mutateAsync(product.id)
    navigate("/products")
  }

  const statusLabels: Record<Product["status"], string> = {
    in_stock: t("products.inStock"),
    low_stock: t("products.lowStock"),
    out_of_stock: t("products.outOfStock"),
  }

  if (isPending) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-4/3 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Package className="size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{t("products.notFound")}</h2>
        <Button variant="outline" onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("products.backToProducts")}
        </Button>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price)

  const categories = [product.category]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 size-4" />
          {t("products.backToProducts")}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEditClick}>
            <Pencil className="mr-2 size-4" />
            {t("common.edit")}
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 size-4" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {product.images.length > 0 ? (
            <>
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-4/3 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className="size-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={cn(
                        "shrink-0 size-16 rounded-md overflow-hidden border-2 transition-colors",
                        selectedIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/50"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-4/3 rounded-lg bg-muted flex items-center justify-center">
              <Package className="size-24 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn("border-0", statusStyles[product.status])}>
              {statusLabels[product.status]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {t("products.stock", { count: product.stock })}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t("products.price")}</p>
            <p className="text-4xl font-bold">{formattedPrice}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t("products.productId")}</p>
            <p className="font-mono text-sm">{product.id}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-8">
        <h2 className="text-xl font-semibold">{t("products.descriptionLabel")}</h2>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <ProductFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        product={product}
        onSubmit={handleFormSubmit}
        categories={categories}
      />

      <ProductDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={product}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
