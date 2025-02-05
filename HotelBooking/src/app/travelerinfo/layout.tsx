import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
export default function Payment_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Nav></Nav>
      {children}
      
      <div className="px-4">
        <Footer></Footer>
      </div>
    </>
  );
}
