import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'International Money Transfer from India for Study Abroad',
  description: 'India’s trusted platform for education consultants, offering fast international money transfers. 100% paperless, real-time tracking, and 10-min remittance.',
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
