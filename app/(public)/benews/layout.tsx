import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BE News – Study Abroad Finance & Payment Insights Blog',
  description: 'Explore BE News by Buyexforex: tips, guides, and insights on international fee payments, forex for education, and study-abroad finance solutions.',
}

export default function BeNewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
