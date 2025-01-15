'use client';
import { Toaster } from "react-hot-toast";
export default function AuthLayout ({children,}: Readonly<{children: React.ReactNode;}>) {

  return <>
    <div>
      {children}
      <Toaster position="top-center" reverseOrder={false}></Toaster>
    </div>
  </>
}