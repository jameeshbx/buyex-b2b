import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Buyex Forex',
  description: 'Log in to your Buyex Forex account securely.',
};

export default function SignInLayout({
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
