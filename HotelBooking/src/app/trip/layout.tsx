import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";

export default function TripLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="customized-bg-gradient">
      {children}
      <Menu></Menu>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
