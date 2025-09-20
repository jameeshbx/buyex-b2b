import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Buyex Forex',
  description: 'Read the terms and conditions of Buyex Forex services.',
};

export default function TermsLayout({
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
