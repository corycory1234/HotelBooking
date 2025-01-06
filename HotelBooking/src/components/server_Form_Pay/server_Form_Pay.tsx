import { useFormState } from "react-dom";
import { Submit_Traveler_Info } from "@/actions/traveler_Info";

// 1. Zod 錯誤訊息初始值
const initialState = {message: ""};

export default function Server_Form_Pay () {
  // 2. 透過 useFormState 套用 Server Actino函式 以及 zod錯誤訊息
  const [state, formAction] = useFormState(Submit_Traveler_Info, initialState)

  return <>

  <form action={formAction} className="flex flex-col gap-2">
    <label htmlFor="name" className="text-gray">Name</label>
    <input type="text" id="name" name="name" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-red">{state.nameError}</p>

    <label htmlFor="surname" className="text-gray">Surname</label>
    <input type="text" id="surname" name="surname" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-red">{state.surnameError}</p>

    <label htmlFor="email" className="text-gray">Email Address</label>
    <input type="text" id="email" name="email" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-red">{state.emailError}</p>

    <label htmlFor="country" className="text-gray">Country</label>
    <select name="country" id="country" className="rounded-lg border-2 border-softGray p-2">
      <option value="taiwan">Taiwan</option>
      <option value="china">China</option>
      <option value="united states">United States</option>
    </select>
    

    <label htmlFor="phone" className="text-gray">Phone Number</label>
    <input type="text" id="phone" name="phone" className="rounded-lg border-2 border-softGray p-2"/>
    <p aria-live="polite" className="text-red">{state.phoneError}</p>

    <button className="bg-primary text-white rounded-xl py-4 mt-6"> Proceed to Pay</button>
  </form>  
  </>
}