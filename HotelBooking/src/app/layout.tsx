import "./globals.css";
import React from "react";
import ProviderRedux from "../provider/provider";
import { Metadata } from "next";

export const metadata = {
  title: "HotelBooking",
  description: "Get special price here!",
  icons: { icon: '/MetaLogo.svg' }
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
      <ProviderRedux>
        {children}
      </ProviderRedux>
      </body>
    </html>
  );
}
