import { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME,
};

export type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = (props: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className="antialiased">{props.children}</body>
    </html>
  );
};

export default RootLayout;
