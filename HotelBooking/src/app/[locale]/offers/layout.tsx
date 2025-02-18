import React from "react";
import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";


export default function Offer_List_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="">
      <Nav></Nav>
    </div>
    {children}
    <Menu></Menu>

    <div className="lg: pt-20 lg: px-4">
      <Footer></Footer>
    </div>
  </>
}
