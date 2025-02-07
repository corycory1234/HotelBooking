import { headers } from "next/headers"
import Link from "next/link";
import Client_Form_Register from "@/components/client_Form_Register/client_Form_Register";

export default function Register() {
  const headerList = headers();
  const referer = headerList.get("referer") || "/";
  console.log(referer);

  return <>

    <div className="bg-primary h-full relative lg:flex lg:justify-center lg:bg-[#F3F3F3] lg:py-4">
      <p className="text-white text-center p-4">Register</p>
      <div className="h-[56px] absolute top-4 left-4">
        <button type="button" className="">
          <Link href={referer}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
        </button>
      </div>

      {/* Register 註冊表單 */}
      <Client_Form_Register></Client_Form_Register>
      {/* Register 註冊表單 */}
    </div>

  </>
}