import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Buyex Forex',
  description: 'Reset your Buyex Forex account password safely.',
};

export default function ForgotPasswordLayout({
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
