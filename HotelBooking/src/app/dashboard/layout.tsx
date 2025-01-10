import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";

export default function SearchLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="">
      {children}
      {/* <Menu></Menu> */}
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
