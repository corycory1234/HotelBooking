import Client_Input_Keyword from "./client-Input-Keyword";
import DateRangePicker from "./dateRangePicker";
import Client_Input_Traveler from "./client-Input-Traveler";

export default function Client_Form_Search () {
  return <>
    <form className="flex flex-col p-4 gap-4 justify-center items-center">
      <Client_Input_Keyword></Client_Input_Keyword>
      <DateRangePicker></DateRangePicker>
      <Client_Input_Traveler></Client_Input_Traveler>
      <button className="bg-primary rounded w-full">Search</button>
    </form>
  </>
}