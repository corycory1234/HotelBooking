import Nav from "@/components/nav/nav";
import Menu from "@/components/menu";
import Footer from "@/components/footer/footer";
import Payment_Progress_Bar from "@/components/payment_Progress_Bar/payment_Progress_Bar";

export default function Booking_Completed_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="min-h-screen flex flex-col">
    <Nav></Nav>
    <div className="hidden lg:block">
      <Payment_Progress_Bar></Payment_Progress_Bar>
    </div>
    <main className="flex-1">
      {children}
    </main>
    <Menu></Menu>
    <div className="px-4">
      <Footer></Footer>
    </div>
    </div>
  );
}
