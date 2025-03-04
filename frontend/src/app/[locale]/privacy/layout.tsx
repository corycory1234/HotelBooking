import React from "react";
import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function PrivacyLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="">
      <Nav></Nav>
    </div>

      {children}

    <div className="lg:px-10 lg:pt-10">
      <Footer></Footer>
    </div>

  
    <Menu></Menu>
  </>
}