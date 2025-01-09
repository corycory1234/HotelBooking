import { useRouter } from "next/navigation";

export default function Previous_Page () {
const router = useRouter();

  return <>
    {/* 返回上頁按鈕 */}
    <div className="bg-primary relative">
    <div className="flex flex-col py-2">
      <p className="text-center text-white">Payment</p>
    </div>

      <div className="absolute top-2 left-4 z-10 h-[56px] cursor-pointer" onClick={() => router.back()}>
        <button type="button" className="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>
    </div>
    {/* 返回上頁按鈕 */}
  
  </>
}