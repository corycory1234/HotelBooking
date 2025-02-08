import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function TripLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>

    <Nav></Nav>

    {children}
    <Menu></Menu>
    <div className="px-4">
      <Footer></Footer>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
