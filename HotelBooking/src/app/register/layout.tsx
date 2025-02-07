'use client';
import { Toaster } from 'react-hot-toast';
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
export default function RegisterLayout ({children,}: Readonly<{children: React.ReactNode;}>) {

  return <>
    <div>
      <Nav></Nav>
      {children}
      <Toaster position="top-center" reverseOrder={false} ></Toaster>
      <div className="px-4">
        <Footer></Footer>
      </div>
    </div>
  </>
}