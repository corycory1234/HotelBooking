import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function CookieLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="lg:pt-20">
      <Nav></Nav>
    </div>

      {children}

    <div className="lg:px-10">
      <Footer></Footer>
    </div>


      <Menu></Menu>

  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}