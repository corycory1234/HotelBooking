import "./globals.css";
import React from "react";
import ProviderRedux from "@/provider/provider";

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
