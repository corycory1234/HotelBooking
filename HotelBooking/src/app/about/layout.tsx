// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

export default function AboutLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div>
      <Nav></Nav>
      {children}
      <Menu></Menu>
      <div className="px-4">
        <Footer></Footer>
      </div>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}
