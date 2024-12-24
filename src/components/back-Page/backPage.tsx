import { headers } from "next/headers"
import Link from "next/link";
import Client_Show_Keyword from "../client-Show-Keyword";
import Modal from "../modal/modal";

export default function BackPage() {
  const headerList = headers();
  const referer = headerList.get("referer") || "/";
  console.log(referer);


  return <>
    <nav className="fixed top-0 left-0 right-0 bg-primary">
      <div className="px-4 h-[56px] flex items-center gap-4">
          <button type="button" className="basis-1/12">
            <Link href={'/'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
          </button>
          <div className="basis-11/12">
            <Client_Show_Keyword></Client_Show_Keyword>
          </div>
      </div>
    </nav>
    {/* <Modal></Modal> */}
  </>
}