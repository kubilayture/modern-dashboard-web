import { ProfileForm, PasswordForm } from "@/components/forms"

export function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ProfileForm />
      <PasswordForm />
    </div>
  )
}
