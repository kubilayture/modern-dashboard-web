import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import type { Category } from "@/types"
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

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSubmit: (data: Omit<Category, "id">) => Promise<void>
}

export function CategoryFormDialog({ open, onOpenChange, category, onSubmit }: CategoryFormDialogProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: [] as string[],
    status: "active" as Category["status"],
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image ? [category.image] : [],
        status: category.status,
      })
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: [],
        status: "active",
      })
    }
  }, [category, open])

  const handleNameChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    setFormData((prev) => ({ ...prev, name: value, slug: category ? prev.slug : slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        ...formData,
        productCount: category?.productCount ?? 0,
        image: formData.image[0] || undefined,
      })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? t("categories.editCategory") : t("categories.addCategory")}
          </DialogTitle>
          <DialogDescription>
            {category ? t("categories.editCategory") : t("categories.addCategory")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("categories.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t("categories.namePlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">{t("categories.slug")}</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder={t("categories.slugPlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t("categories.categoryDescription")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={t("categories.descriptionPlaceholder")}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("categories.image")}</Label>
              <ImageUpload
                value={formData.image}
                onChange={(urls) => setFormData((prev) => ({ ...prev, image: urls }))}
                multiple={false}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t("categories.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Category["status"]) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("categories.active")}</SelectItem>
                  <SelectItem value="inactive">{t("categories.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
