import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { Order } from "@/types"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface OrderStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onSubmit: (orderId: string, status: Order["status"]) => Promise<void>
}

export function OrderStatusDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: OrderStatusDialogProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Order["status"]>("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && order) {
      setStatus(order.status)
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = async () => {
    if (!order) return

    setIsSubmitting(true)
    try {
      await onSubmit(order.id, status)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("orders.changeStatus")}</DialogTitle>
          <DialogDescription>
            {t("orders.changeStatusDescription", { id: order?.id })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("orders.currentStatus")}</Label>
            <p className="text-sm text-muted-foreground">
              {order && t(`orders.${order.status}`)}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">{t("orders.newStatus")}</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Order["status"])}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t("orders.pending")}</SelectItem>
                <SelectItem value="processing">{t("orders.processing")}</SelectItem>
                <SelectItem value="completed">{t("orders.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("orders.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <Button onClick={handleSubmit} disabled={isSubmitting || status === order?.status}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSubmitting ? t("common.loading") : t("orders.updateStatus")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
