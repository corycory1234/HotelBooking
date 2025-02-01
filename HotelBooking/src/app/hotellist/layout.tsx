import React from "react";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import Form_Search_Pc from "@/components/server-Form-Search/form_Search_Pc";

export default function HotelList_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Nav></Nav>
      <div className="hidden lg:block lg:fixed lg:top-[70px] lg:w-full lg:z-10">
        <Form_Search_Pc></Form_Search_Pc>
      </div>
      {children}

      <div className="lg:px-4">
        <Footer></Footer>
      </div>
    </>
  );
}


