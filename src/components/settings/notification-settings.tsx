import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export function NotificationSettings() {
  const { t } = useTranslation()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.notifications")}</CardTitle>
        <CardDescription>{t("settings.notificationsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-4">
          <Checkbox
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => setEmailNotifications(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="email-notifications" className="cursor-pointer font-medium">
              {t("settings.emailNotifications")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.emailNotificationsDesc")}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-4">
          <Checkbox
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={(checked) => setPushNotifications(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="push-notifications" className="cursor-pointer font-medium">
              {t("settings.pushNotifications")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.pushNotificationsDesc")}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-4">
          <Checkbox
            id="marketing-emails"
            checked={marketingEmails}
            onCheckedChange={(checked) => setMarketingEmails(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="marketing-emails" className="cursor-pointer font-medium">
              {t("settings.marketingEmails")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.marketingEmailsDesc")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
