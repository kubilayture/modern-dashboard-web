import { AppearanceSettings, NotificationSettings } from "@/components/settings"

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <AppearanceSettings />
      <NotificationSettings />
    </div>
  )
}
