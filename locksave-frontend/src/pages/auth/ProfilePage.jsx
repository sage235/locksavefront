import PageHeader from '../components/layout/PageHeader'
export default function ProfilePage() {
  return <PageHeader title="Profile" subtitle="Coming in step 9." />
}import PageHeader from '../components/layout/PageHeader'
import ProfileForm from '../components/profile/ProfileForm'
import PasswordForm from '../components/profile/PasswordForm'
import DeactivateSection from '../components/profile/DeactivateSection'
import Button from '../components/ui/Button'
import { useAuth } from '../auth/useAuth'
import { initials } from '../utils/format'

const Section = ({ title, children }) => (
  <section>
    <h2 className="mb-4 text-xl">{title}</h2>
    {children}
  </section>
)

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const name = user.fullName ?? user.email ?? ''

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details and security." />
      <div className="max-w-xl space-y-12">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-fir-700 font-display text-2xl font-semibold text-cream-100">
            {initials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold">{name}</p>
            <p className="truncate text-muted">{user.email}</p>
          </div>
        </div>

        <Section title="Your details"><ProfileForm /></Section>
        <Section title="Password"><PasswordForm /></Section>
        <Section title="Session">
          <Button variant="ghost" onClick={logout}>Log out</Button>
        </Section>
        <DeactivateSection />
      </div>
    </>
  )
}