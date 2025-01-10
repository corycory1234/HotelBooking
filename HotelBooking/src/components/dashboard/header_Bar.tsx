import { OtherSVG } from "../client_Svg/client_Svg";
import Dashboard_Content from "./dashboard_Content";

export default function Header_Bar_Dashboard () {

  return <>
  <div className="flex flex-col gap-2">

    {/** 頂部Bar */}
    <div className="flex justify-between items-center px-4 border-b border-softGray">
      <p>Dashboard</p>
      <div className="py-2 flex items-center gap-2">
        <div className="bg-softGray rounded-full p-2">
          <OtherSVG name={"admin"} className="w-5 h-auto"></OtherSVG>
        </div>
        <p>Admin</p>
      </div>
    </div>
    {/** 頂部Bar */}

    <Dashboard_Content></Dashboard_Content>

  </div>
  </>
}