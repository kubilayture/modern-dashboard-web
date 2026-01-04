import { useTranslation } from "react-i18next"
import type { Category } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2, Power, PowerOff, FolderTree } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryCardProps {
  category: Category
  onView?: (category: Category) => void
  onEdit?: (category: Category) => void
  onDelete?: (category: Category) => void
  onToggleStatus?: (category: Category) => void
}

const statusStyles: Record<Category["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function CategoryCard({ category, onView, onEdit, onDelete, onToggleStatus }: CategoryCardProps) {
  const { t } = useTranslation()

  const statusLabels: Record<Category["status"], string> = {
    active: t("categories.active"),
    inactive: t("categories.inactive"),
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onView?.(category)}
    >
      <div className="flex">
        {category.image ? (
          <div className="w-24 h-24 shrink-0 bg-muted">
            <img src={category.image} alt={category.name} className="size-full object-cover" />
          </div>
        ) : (
          <div className="w-24 h-24 shrink-0 bg-muted flex items-center justify-center">
            <FolderTree className="size-8 text-muted-foreground/40" />
          </div>
        )}
        <CardContent className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2 h-full">
            <div className="flex flex-col justify-between h-full min-w-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{category.name}</h3>
                  <Badge variant="outline" className={cn("border-0 shrink-0 text-xs", statusStyles[category.status])}>
                    {statusLabels[category.status]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{category.slug}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {category.productCount} {t("categories.productCount").toLowerCase()}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(category)}>
                  <Eye className="mr-2 size-4" />
                  {t("common.view")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(category)}>
                  <Pencil className="mr-2 size-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleStatus?.(category)}>
                  {category.status === "active" ? (
                    <>
                      <PowerOff className="mr-2 size-4" />
                      {t("categories.deactivateCategory")}
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 size-4" />
                      {t("categories.activateCategory")}
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(category)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Card>
      <div className="flex">
        <Skeleton className="w-24 h-24 shrink-0" />
        <CardContent className="flex-1 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
