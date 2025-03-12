'use client';
import { Toaster } from "react-hot-toast";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function Forget_Password_Layout ({children,}: Readonly<{children: React.ReactNode;}>) {

  return <div className="min-h-screen flex flex-col">
    <Nav></Nav>
    <main className="flex-1">
      {children}
    </main>
    <Toaster position="top-center" reverseOrder={false}></Toaster>

    <div className="px-4">
      <Footer></Footer>
    </div>
  </div>
}