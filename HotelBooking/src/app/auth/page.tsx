import { headers } from "next/headers"
import Link from "next/link";
// import Server_Form_Login from "../../components/server_Form_Login/client_Form_Login";
import Server_Form_Login from "@/components/server_Form_Login/client_Form_Login";

export default function Login () {
  const headerList = headers();
  const referer = headerList.get("referer") || "/";
  console.log(referer);

  return <>
    <div className="bg-primary h-screen relative flex flex-col gap-10 lg:hidden">
      <p className="text-white text-center p-4">Sign In</p>
      <div className="absolute top-4 left-4 h-[56px]">
          <button type="button" className="">
            <Link href={referer}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
          </button>
      </div>

      {/* Login表單 */}
      <Server_Form_Login></Server_Form_Login>
      {/* Login表單 */}
    </div>

    <div className="hidden lg:flex bg-[#F3F3F3] py-4">

      {/* Login表單 */}
      <Server_Form_Login></Server_Form_Login>
      {/* Login表單 */}
    </div>
  </>
}