// import ProviderRedux from "@/provider/provider";
import Menu from "../../components/menu";

export default function MyReviewLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return <>
    <div>
      {children}
      <Menu></Menu>
    </div>
  </>
      {/* <ProviderRedux> */}
      {/* </ProviderRedux> */}
  ;
}