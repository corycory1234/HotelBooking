import Client_Input_Password from "./client-Input-Password"
export default function Server_Form_Login () {


  return <>
      <div className="relative">
        <img src="/Logo.svg" className="absolute left-[40%] w-20 h-20" alt="" /> 
      </div>
      
    <div className="my-bg-gradient min-h-full flex flex-col mt-10">
      {/** 電子郵件 SVG */}
      <div className="relative">
        <img src="/account/Email.svg" alt="" className="absolute top-[6.85rem] left-8"/>
      </div>
      {/** 電子郵件 SVG */}

      <form action="" className="flex flex-col px-4 pt-14 gap-4">

        {/** 電子郵件 */}
        <label htmlFor="email" className="text-gray">Enter Email</label>
        <input type="text" id="email" name="email" className="rounded border-2 border-softGray py-2 px-10" placeholder="example@gmail.com"/>
        {/** 電子郵件 */}

        {/* 密碼 */}
        <Client_Input_Password></Client_Input_Password>
        {/* 密碼 */}
        
        <button type="button" className="bg-primary rounded-lg py-3 text-white">Sign In</button>
      </form>
      
      <div className="pt-28 flex flex-col justify-center items-center gap-4">
        <p className="text-center text-sm">Or Sign in With</p>
        <button className="bg-white rounded-lg py-3 px-6">
          <img src="/account/Google.svg" alt="" />
        </button>
      </div>
    </div>
  </>
}