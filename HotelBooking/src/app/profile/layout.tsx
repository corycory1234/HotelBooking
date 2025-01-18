import React from "react";
// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";
import { Toaster } from "react-hot-toast";

export default function ProfileLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div>
      {children}
      <Menu></Menu>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
