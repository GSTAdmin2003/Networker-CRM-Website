import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Networker CRM",
  description: "The CRM built for networkers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
