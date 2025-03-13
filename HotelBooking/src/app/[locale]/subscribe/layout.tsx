import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Subscribe',
}

export default function Subscribe_Layout_Pc ({children,}: Readonly<{children: React.ReactNode;}>) {

  return <div className="min-h-screen flex flex-col">
    <Nav></Nav>
    {children}
    <div className="px-4">
      <Footer></Footer>
    </div>
  </div>
}