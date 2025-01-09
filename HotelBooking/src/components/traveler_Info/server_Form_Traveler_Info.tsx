import { useFormState } from "react-dom";
import { Submit_Traveler_Info } from "@/actions/traveler_Info";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// 1. Zod 錯誤訊息初始值
const initialState = {message: ""};

export default function Server_Form_Traveler_Info() {
  // 2. 透過 useFormState 套用 Server Actino函式 以及 zod錯誤訊息
  const [state, formAction] = useFormState(Submit_Traveler_Info, initialState)

  // 3. 拿取Redux - 預定房型之數據
  const redux_Booked_Room = useSelector((state: RootState) => state.booked_Room)

  return <>

  <form className="flex flex-col gap-2 p-4">
    <div className="flex flex-col mb-32">

    <label htmlFor="name" className="text-gray">Name</label>
    <input type="text" id="name" name="name" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-customRed">{state.nameError}</p>

    <label htmlFor="surname" className="text-gray">Surname</label>
    <input type="text" id="surname" name="surname" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-customRed">{state.surnameError}</p>

    <label htmlFor="email" className="text-gray">Email Address</label>
    <input type="text" id="email" name="email" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-customRed">{state.emailError}</p>

    <label htmlFor="country" className="text-gray">Country</label>
    <select name="country" id="country" className="rounded-lg border-2 border-softGray p-2">
      <option value="taiwan">Taiwan</option>
      <option value="china">China</option>
      <option value="united states">United States</option>
    </select>
    

    <label htmlFor="phone" className="text-gray">Phone Number</label>
    <input type="text" id="phone" name="phone" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-customRed">{state.phoneError}</p>
    </div>

    {/** formAction 寫在<button>上*/}
    <div className="flex flex-col fixed bottom-0 right-0 p-4 customized-bg-gradient  w-full border-t border-softGray">
      <div className="flex justify-between">
        <p className="font-bold">Total Price</p>
        <p className="font-bold">$ {redux_Booked_Room.price}</p>
      </div>
      <button formAction={formAction} className="bg-primary text-white rounded-xl py-4 mt-4"> Proceed to Pay</button>
    </div>
    {/** formAction 寫在<button>上*/}

  </form>
    
  </>
}