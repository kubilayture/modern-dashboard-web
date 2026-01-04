import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, X, Plus, ChevronDown } from "lucide-react"
import type { Category } from "@/types"
import { useGetCategories, useCreateCategory, useUpdateCategory, useUpdateCategoryStatus, useDeleteCategory } from "@/hooks"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DataTablePagination,
  DataTableViewOptions,
  DataTableLoading,
  DataTableEmpty,
} from "@/components/table"
import { CategoryCard, CategoryCardSkeleton } from "@/components/cards"
import { useCategoriesColumns } from "./categories-columns"
import { CategoryFormDialog } from "./category-form-dialog"
import { CategoryDeleteDialog } from "./category-delete-dialog"

const ITEMS_PER_PAGE = 6

export function CategoriesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: categories = [], isPending } = useGetCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const updateCategoryStatus = useUpdateCategoryStatus()
  const deleteCategoryMutation = useDeleteCategory()

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const [mobileSearch, setMobileSearch] = useState("")
  const [mobileStatusFilter, setMobileStatusFilter] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filteredCategories = useMemo(() => {
    let result = categories

    if (mobileSearch) {
      const search = mobileSearch.toLowerCase()
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(search) ||
          category.slug.toLowerCase().includes(search) ||
          category.description.toLowerCase().includes(search)
      )
    }

    if (mobileStatusFilter !== "all") {
      result = result.filter((category) => category.status === mobileStatusFilter)
    }

    return result
  }, [categories, mobileSearch, mobileStatusFilter])

  const visibleCategories = filteredCategories.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCategories.length

  const handleAddClick = () => {
    setEditingCategory(null)
    setFormDialogOpen(true)
  }

  const handleViewClick = (category: Category) => {
    navigate(`/categories/${category.id}`)
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setFormDialogOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === "active" ? "inactive" : "active"
    await updateCategoryStatus.mutateAsync({ id: category.id, status: newStatus })
  }

  const handleFormSubmit = async (data: Omit<Category, "id">) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, data })
    } else {
      await createCategory.mutateAsync(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return
    await deleteCategoryMutation.mutateAsync(deletingCategory.id)
    setDeletingCategory(null)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleResetMobileFilters = () => {
    setMobileSearch("")
    setMobileStatusFilter("all")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const columns = useCategoriesColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
    onToggleStatus: handleToggleStatus,
  })

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  const isFiltered = columnFilters.length > 0 || globalFilter !== ""
  const isMobileFiltered = mobileSearch !== "" || mobileStatusFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col justify-between space-y-2">
              <CardTitle>{t("categories.title")}</CardTitle>
              <CardDescription>{t("categories.description")}</CardDescription>
            </div>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 size-4" />
              {t("categories.addCategory")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder={t("categories.searchPlaceholder")}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-9 pl-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                      table.getColumn("status")?.setFilterValue(value === "all" ? undefined : [value])
                    }
                  >
                    <SelectTrigger className="h-9 w-35">
                      <SelectValue placeholder={t("categories.allStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("categories.allStatus")}</SelectItem>
                      <SelectItem value="active">{t("categories.active")}</SelectItem>
                      <SelectItem value="inactive">{t("categories.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {isFiltered && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        table.resetColumnFilters()
                        setGlobalFilter("")
                      }}
                      className="h-8 px-2 lg:px-3"
                    >
                      {t("common.reset")}
                      <X className="ml-2 size-4" />
                    </Button>
                  )}
                  <DataTableViewOptions table={table} />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isPending ? (
                      <DataTableLoading columns={columns.length} />
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <DataTableEmpty />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("categories.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("categories.description")}</p>
          </div>
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="mr-2 size-4" />
            {t("categories.addCategory")}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={t("categories.searchPlaceholder")}
              value={mobileSearch}
              onChange={(e) => {
                setMobileSearch(e.target.value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={mobileStatusFilter}
              onValueChange={(value) => {
                setMobileStatusFilter(value)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("categories.allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("categories.allStatus")}</SelectItem>
                <SelectItem value="active">{t("categories.active")}</SelectItem>
                <SelectItem value="inactive">{t("categories.inactive")}</SelectItem>
              </SelectContent>
            </Select>

            {isMobileFiltered && (
              <Button variant="ghost" size="sm" onClick={handleResetMobileFilters}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("common.noResults")}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visibleCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>

            {hasMore && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
              >
                {t("common.loadMore")}
                <ChevronDown className="ml-2 size-4" />
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {visibleCategories.length} / {filteredCategories.length}
            </p>
          </>
        )}
      </div>

      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        category={editingCategory}
        onSubmit={handleFormSubmit}
      />

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
