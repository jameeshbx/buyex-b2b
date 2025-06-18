
import SettingsContent from "@/components/landing-content/Settings";
import SessionProvider from "@/components/session-provider";

export default function Settings() {
  return (
    <SessionProvider>
      <SettingsContent />
    </SessionProvider>
  )
}


