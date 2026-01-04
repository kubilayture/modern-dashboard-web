import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
  disabled?: boolean
  className?: string
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

function isValidImageFile(file: File): { valid: boolean; error?: string } {
  const extension = getFileExtension(file.name)

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: "invalidFileType" }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "fileTooLarge" }
  }

  return { valid: true }
}

function createMockUrl(file: File): string {
  return URL.createObjectURL(file)
}

export function ImageUpload({ value, onChange, multiple = false, disabled = false, className }: ImageUploadProps) {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    const newUrls: string[] = []
    const errors: string[] = []

    const filesToProcess = multiple ? Array.from(files) : [files[0]]

    for (const file of filesToProcess) {
      const validation = isValidImageFile(file)

      if (validation.valid) {
        const mockUrl = createMockUrl(file)
        newUrls.push(mockUrl)
      } else {
        errors.push(`${file.name}: ${t(`upload.${validation.error}`)}`)
      }
    }

    if (errors.length > 0) {
      setError(errors.join(", "))
    }

    if (newUrls.length > 0) {
      if (multiple) {
        onChange([...value, ...newUrls])
      } else {
        onChange(newUrls)
      }
    }
  }, [multiple, onChange, value, t])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }, [disabled, handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    e.target.value = ""
  }, [handleFiles])

  const handleRemove = useCallback((index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
    setError(null)
  }, [value, onChange])

  const handleRemoveAll = useCallback(() => {
    onChange([])
    setError(null)
  }, [onChange])

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
          "group"
        )}
      >
        <input
          type="file"
          accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(",")}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <div className={cn(
            "size-12 rounded-full flex items-center justify-center mb-3 transition-colors",
            isDragOver ? "bg-primary/10" : "bg-muted",
            "group-hover:bg-primary/10"
          )}>
            <Upload className={cn(
              "size-6 transition-colors",
              isDragOver ? "text-primary" : "text-muted-foreground",
              "group-hover:text-primary"
            )} />
          </div>
          <p className="text-sm font-medium mb-1">
            {t("upload.dragAndDrop")}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {t("upload.or")} <span className="text-primary font-medium">{t("upload.browse")}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {t("upload.allowedTypes")}: {ALLOWED_EXTENSIONS.join(", ").toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("upload.maxSize")}: 5MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {value.length} {value.length === 1 ? t("upload.imageSelected") : t("upload.imagesSelected")}
            </p>
            {value.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAll}
                disabled={disabled}
                className="h-7 text-xs"
              >
                {t("upload.removeAll")}
              </Button>
            )}
          </div>
          <div className={cn(
            "grid gap-2",
            multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"
          )}>
            {value.map((url, index) => (
              <div
                key={index}
                className={cn(
                  "relative group rounded-lg overflow-hidden bg-muted",
                  multiple ? "aspect-square" : "aspect-video max-w-xs"
                )}
              >
                {url.startsWith("blob:") || url.startsWith("http") ? (
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </div>
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
