import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "@/components/menu";

export default function Booking_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="customized-bg-gradient pb-20 lg:pb-0 lg:mt-[70px]">
      {children}
      <Menu></Menu>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
