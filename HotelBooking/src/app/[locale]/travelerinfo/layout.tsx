import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import Payment_Progress_Bar from "@/components/payment_Progress_Bar/payment_Progress_Bar";
export default function Payment_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Nav></Nav>
      <div className="hidden lg:block">
        <Payment_Progress_Bar></Payment_Progress_Bar>
      </div>
      {children}
      
      <div className="px-4">
        <Footer></Footer>
      </div>
    </>
  );
}
