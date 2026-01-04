import { useTranslation } from "react-i18next"
import { useThemeStore } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Check, Moon, Sun } from "lucide-react"

export function AppearanceSettings() {
  const { t } = useTranslation()
  const { theme, setTheme } = useThemeStore()

  const themes = [
    { value: "light" as const, label: t("settings.light"), icon: Sun },
    { value: "dark" as const, label: t("settings.dark"), icon: Moon },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.appearance")}</CardTitle>
        <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>{t("settings.theme")}</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all",
                  theme === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Icon className="size-6" />
                <span className="text-sm font-medium">{label}</span>
                {theme === value && (
                  <div className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
