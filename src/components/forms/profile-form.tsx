import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Camera } from "lucide-react"

export function ProfileForm() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage("")

    await new Promise((resolve) => setTimeout(resolve, 800))

    setMessage(t("profile.profileUpdated"))
    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.personalInfo")}</CardTitle>
        <CardDescription>{t("profile.personalInfoDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar className="size-24">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute -bottom-1 -right-1 size-8 rounded-full"
              >
                <Camera className="size-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{t("profile.profilePicture")}</p>
              <p className="text-sm text-muted-foreground">
                {t("profile.profilePictureHint")}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.fullName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("profile.namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("profile.emailPlaceholder")}
              />
            </div>
          </div>
          {message && (
            <p className="text-sm font-medium text-success">{message}</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSaving ? t("profile.saving") : t("profile.saveChanges")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
