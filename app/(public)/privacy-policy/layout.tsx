import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Buyex Forex',
  description: 'Learn how Buyex Forex protects and uses your information.',
};

export default function PrivacyPolicyLayout({
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
