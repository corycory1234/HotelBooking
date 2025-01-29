'use client';
import { useDispatch, useSelector } from "react-redux";
import { updateKeyword } from "../../store/form-Search/formSearchSlice";
import { RootState, AppDispatch } from "../../store/store";

export default function Client_Input_Keyword () {
  // 1. 提取 Redux - formSeach表單 keyword
  const dispatch: AppDispatch = useDispatch();
  const keyword = useSelector((state: RootState) => state.formSearch!.keyword)

  return <>
  <div className="relative w-full ">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-2 right-2 text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>


    <input type="text" placeholder="Where are you going?" 
    className="w-full py-2 px-4 rounded outline-none lg:border lg:border-gray bg-white"
    onChange={(event) => dispatch(updateKeyword(event.target.value))}
    value={keyword}
    name="destination"/>


  </div>

  </>
}