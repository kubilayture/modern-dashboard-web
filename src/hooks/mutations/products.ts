import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { createProduct, updateProduct, deleteProduct } from "@/api"
import { productKeys } from "../queries/products"
import type { Product } from "@/types"

export function useCreateProduct() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Product, "id">) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(t("products.productCreated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useUpdateProduct() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Product, "id"> }) =>
      updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
      toast.success(t("products.productUpdated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useDeleteProduct() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(t("products.productDeleted"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}
