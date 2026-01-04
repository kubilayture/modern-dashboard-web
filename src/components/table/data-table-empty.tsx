import { useTranslation } from "react-i18next"
import { FileX2 } from "lucide-react"

interface DataTableEmptyProps {
  message?: string
}

export function DataTableEmpty({ message }: DataTableEmptyProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX2 className="size-12 text-muted-foreground/50" />
      <p className="mt-4 text-sm text-muted-foreground">{message ?? t("table.noResults")}</p>
    </div>
  )
}
