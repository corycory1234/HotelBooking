import React from "react";

export default function Hotel_List_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="">
      {children}
    </div>
  </>
  ;
}
