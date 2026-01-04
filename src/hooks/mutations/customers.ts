import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { createCustomer, updateCustomer, updateCustomerStatus, deleteCustomer } from "@/api"
import { customerKeys } from "../queries/customers"
import type { Customer } from "@/types"

export function useCreateCustomer() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Customer, "id">) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success(t("customers.customerCreated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useUpdateCustomer() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Customer, "id"> }) =>
      updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
      toast.success(t("customers.customerUpdated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useUpdateCustomerStatus() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Customer["status"] }) =>
      updateCustomerStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
      toast.success(t("customers.statusUpdated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useDeleteCustomer() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success(t("customers.customerDeleted"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}
