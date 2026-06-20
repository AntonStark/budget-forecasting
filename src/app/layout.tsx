import "@/styles/common.css";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Бюджет",
  icons: "/icon.svg",
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}