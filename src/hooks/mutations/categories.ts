import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { createCategory, updateCategory, updateCategoryStatus, deleteCategory } from "@/api"
import { categoryKeys } from "../queries/categories"
import type { Category } from "@/types"

export function useCreateCategory() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Category, "id">) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(t("categories.categoryCreated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useUpdateCategory() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Category, "id"> }) =>
      updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
      toast.success(t("categories.categoryUpdated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useUpdateCategoryStatus() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Category["status"] }) =>
      updateCategoryStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
      toast.success(t("categories.statusUpdated"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}

export function useDeleteCategory() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(t("categories.categoryDeleted"))
    },
    onError: () => {
      toast.error(t("common.error"))
    },
  })
}
