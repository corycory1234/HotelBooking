import { OtherSVG } from "@/components/client_Svg/client_Svg";
import Link from "next/link";
export default function Verify_Email () {

  return <>
    <div className="h-screen px-4 flex flex-col justify-center items-center gap-5">
      <OtherSVG name={"email"} className="w-10 h-auto"></OtherSVG>
      <p className="text-lg font-bold">Email Verification Required</p>
      <div className="flex bg-green-300 p-2 rounded gap-2">
        <OtherSVG name={"tick"} className="w-6 h-auto"></OtherSVG>
        <p className="">Registration Successful! Please verify your email</p>
      </div>

      <p>We've sent a verification link to your email address. Please 
      check your inbox and click the link to activate your account. </p>

      <Link href={"/"}>
        <button type="button" className="bg-primary text-white p-5 rounded-lg font-bold">
          Verify Your Email
        </button>
      </Link>
    </div>
  </>
}