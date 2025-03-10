import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function MyReviewLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <Nav></Nav>
    {children}
    <Menu></Menu>
    <div className="px-4">
      <Footer></Footer>
    </div>
  </>
}