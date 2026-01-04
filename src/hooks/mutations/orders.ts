import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { updateOrderStatus } from "@/api"
import { orderKeys } from "../queries/orders"
import type { Order } from "@/types"

export function useUpdateOrderStatus() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) })
      toast.success(t("orders.statusUpdated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}
