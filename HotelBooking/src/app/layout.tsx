import "./globals.css";
import React from "react";
import ProviderRedux from "../provider/provider";
import { Metadata } from "next";
// 1. Next UI, for 價錢 Range Slider
import {NextUIProvider} from "@nextui-org/system";

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
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </ProviderRedux>
      </body>
    </html>
  );
}
