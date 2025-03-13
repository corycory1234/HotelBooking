import React from "react";
import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'My Trip',
}

export default function TripLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <div className="min-h-screen flex flex-col">
    <Nav></Nav>
    <main className="flex-1">
      {children}
    </main>
    <Menu></Menu>
    <div className="px-4">
      <Footer></Footer>
    </div>
  </div>
}
