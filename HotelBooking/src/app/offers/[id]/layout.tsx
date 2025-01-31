import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function OfferLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div>
      <div className="">
        <Nav></Nav>
      </div>
      {children}
      <Menu></Menu>

      <div className="lg: pt-20 lg: px-4">
        <Footer></Footer>
      </div>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}