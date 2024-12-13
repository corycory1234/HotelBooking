'use client';
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import React from "react";

// 1. 用於更複雜的狀況
interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
