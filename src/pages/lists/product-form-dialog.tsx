import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import type { Product, Currency } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (data: Omit<Product, "id">) => Promise<void>
  categories: string[]
}

type FormErrors = {
  name?: string
  description?: string
  category?: string
  price?: string
  currency?: string
  stock?: string
  status?: string
}

const currencies: Currency[] = ["USD", "EUR", "TRY", "GBP"]

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  categories,
}: ProductFormDialogProps) {
  const { t } = useTranslation()
  const isEditing = !!product

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [stock, setStock] = useState("")
  const [status, setStatus] = useState<Product["status"]>("in_stock")
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (product) {
        setName(product.name)
        setDescription(product.description)
        setCategory(product.category)
        setPrice(product.price.toString())
        setCurrency(product.currency)
        setStock(product.stock.toString())
        setStatus(product.status)
        setImages(product.images)
      } else {
        setName("")
        setDescription("")
        setCategory("")
        setPrice("")
        setCurrency("USD")
        setStock("")
        setStatus("in_stock")
        setImages([])
      }
      setErrors({})
    }
  }, [open, product])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = t("products.nameRequired")
    }
    if (!category) {
      newErrors.category = t("products.categoryRequired")
    }
    if (!price) {
      newErrors.price = t("products.priceRequired")
    } else if (parseFloat(price) <= 0) {
      newErrors.price = t("products.pricePositive")
    }
    if (!currency) {
      newErrors.currency = t("products.currencyRequired")
    }
    if (stock === "") {
      newErrors.stock = t("products.stockRequired")
    } else if (parseInt(stock) < 0) {
      newErrors.stock = t("products.stockPositive")
    }
    if (!status) {
      newErrors.status = t("products.statusRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        category,
        price: parseFloat(price),
        currency,
        stock: parseInt(stock),
        status,
        images,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("products.editProduct") : t("products.addProduct")}
          </DialogTitle>
          <DialogDescription>
            {t("products.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("products.productName")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("products.namePlaceholder")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("products.descriptionLabel")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("products.descriptionPlaceholder")}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t("products.category")}</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("products.categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t("products.price")}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t("products.pricePlaceholder")}
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t("products.currency")}</Label>
              <Select
                value={currency}
                onValueChange={(value) => setCurrency(value as Currency)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("products.currencyPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((cur) => (
                    <SelectItem key={cur} value={cur}>
                      {cur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">{t("products.stockColumn")}</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder={t("products.stockPlaceholder")}
                disabled={isSubmitting}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("products.status")}</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as Product["status"])}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("products.statusPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">{t("products.inStock")}</SelectItem>
                  <SelectItem value="low_stock">{t("products.lowStock")}</SelectItem>
                  <SelectItem value="out_of_stock">{t("products.outOfStock")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("products.images")}</Label>
            <ImageUpload
              value={images}
              onChange={setImages}
              multiple={true}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSubmitting
                ? t("common.loading")
                : isEditing
                  ? t("common.save")
                  : t("products.addProduct")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
