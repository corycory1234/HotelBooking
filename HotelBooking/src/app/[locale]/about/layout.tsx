import Menu from "@/components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function AboutLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div className="min-h-screen flex flex-col">
      <Nav></Nav>
      <main className="flex-1">
        {children}
      </main>
      <Menu></Menu>
      <div className="px-4">
        <Footer></Footer>
      </div>
    </div>
  </>
}
