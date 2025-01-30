'use client';
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Avatar () {
  // 1. Redux - 查看是否登入
  const redux_Verify_Session = useSelector((state: RootState) => state.verify_Session);

  return <>
    {redux_Verify_Session.success === true ? 
      <div className="flex justify-end p-2 lg:h-[28%]">
        <Link href={"/profile"} className="lg:hidden">
          <img src="/account/avatarsm.png" alt="" />
        </Link>
      </div>
    : 
      <div className="flex justify-between p-4 h-[28%]">
        <></>
      </div>
    }
  </>
}