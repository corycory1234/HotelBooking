import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateBedType } from "@/store/form-Search/formSearchSlice";

export default function Client_BedType () {
  // 1. Redux 透過 dispatch 拿取 Redux 之函式
  const dispatch: AppDispatch = useDispatch();

  // 2. Redudx 取 rangeSlider 初始值
  const redux_BedType = useSelector((state: RootState) => state.formSearch.bedType) || [];

  // 3. Redux 床型 Checkbox 打勾/取消 函式
  const handel_BedType = (bed: string, isChecked: boolean) => {
    if(isChecked){
      dispatch(updateBedType([...redux_BedType, bed]));
    } else {
      dispatch(updateBedType(redux_BedType.filter((item) => item !== bed)));
    }
  };


  return <>
    <div className="space-y-2">          
      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded border-gray" value="singleBed" name="bedtype"
        checked={redux_BedType.includes("singleBed")}
        onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>
        <span>Single Bed</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded border-gray" value="twinBed" name="bedtype"
        checked={redux_BedType.includes("twinBed")}
        onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
        <span>Twin Bed</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded border-gray" value="doubleBed" name="bedtype"
        checked={redux_BedType.includes("doubleBed")}
        onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
        <span>Double Bed</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded border-gray" value="queenBed" name="bedtype"
        checked={redux_BedType.includes("queenBed")}
        onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
        <span>Queen Bed</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded border-gray" value="kingBed" name="bedtype"
        checked={redux_BedType.includes("kingBed")}
        onChange={(event) => handel_BedType(event.target.value, event.target.checked)}/>            
        <span>King Bed</span>
      </label>
    </div>
  
  </>
}