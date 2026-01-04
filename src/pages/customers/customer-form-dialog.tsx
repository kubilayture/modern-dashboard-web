import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import type { Customer } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onSubmit: (data: Omit<Customer, "id">) => Promise<void>
}

export function CustomerFormDialog({ open, onOpenChange, customer, onSubmit }: CustomerFormDialogProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as Customer["status"],
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
      })
    }
  }, [customer, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        ...formData,
        totalOrders: customer?.totalOrders ?? 0,
        totalSpent: customer?.totalSpent ?? 0,
        createdAt: customer?.createdAt ?? new Date().toISOString().split("T")[0],
        avatar: customer?.avatar,
      })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? t("customers.editCustomer") : t("customers.addCustomer")}
          </DialogTitle>
          <DialogDescription>
            {customer ? t("customers.editCustomer") : t("customers.addCustomer")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("customers.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t("customers.namePlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("customers.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={t("customers.emailPlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("customers.phone")}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder={t("customers.phonePlaceholder")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">{t("customers.address")}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder={t("customers.addressPlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t("customers.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Customer["status"]) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("customers.active")}</SelectItem>
                  <SelectItem value="inactive">{t("customers.inactive")}</SelectItem>
                  <SelectItem value="banned">{t("customers.banned")}</SelectItem>
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
