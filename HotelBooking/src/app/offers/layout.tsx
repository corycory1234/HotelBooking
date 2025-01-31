import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";

export default function Offer_List_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div>
      {children}
      <Menu></Menu>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
