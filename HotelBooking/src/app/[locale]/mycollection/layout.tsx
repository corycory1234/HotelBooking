import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'My Collection',
}

export default function MyCollectionLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <Nav></Nav>
    {children}
    <Menu></Menu>
    <div className="px-4">
      <Footer></Footer>
    </div>
  </>
}
