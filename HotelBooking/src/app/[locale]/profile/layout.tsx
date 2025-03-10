import React from "react";
import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";

export default function ProfileLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="lg:pt-20">
      <Nav></Nav>
    </div>
    {children}
    <Menu></Menu>

    <div className="lg:py-2 lg:px-4">
      <Footer></Footer>
    </div>
    <Toaster position="top-center" reverseOrder={false}></Toaster>  
  </>
}
