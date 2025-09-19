import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure International Money Transfer from India for Study Abroad',
  description: 'India\'s most trusted platform for education consultants, offering international money transfer from India. 100% paperless, real-time tracking, and 10-min remittance.',
};

export default function HomeLayout({
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
