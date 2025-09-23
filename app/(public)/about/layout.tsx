import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buyexforex – Trusted Partner for Sending Money Abroad India',
  description: 'Buyexforex is a fintech platform simplifying study-abroad payments for education consultants with secure, paperless, and compliant 24×7 services.'
};

export default function AboutLayout({
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
