import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateFacility } from "@/store/form-Search/formSearchSlice";
import { useState } from "react";

// 0. 所有設施 Arr
const facility_Arr = ["pool", "balcony", "24H Check-In", "gym", "parking", "bathtub", "kitchen", "wifi",]

export default function Client_Faciliy () {
  // 1. Redux 透過 dispatch 拿取 Redux 之函式
  const dispatch: AppDispatch = useDispatch();

  // 2. Redudx 取 facility 初始值
  const redux_Facility = useSelector((state: RootState) => state.formSearch.facility) || [];

  // 3. Redux 設施 Checkbox 打勾/取消 函式
  const handel_Facility = (facility: string, isChecked: boolean) => {
    if(isChecked) {
      dispatch(updateFacility([...redux_Facility, facility]));
    } else {
      dispatch(updateFacility(redux_Facility.filter((item) => item !== facility)));
    }
  }

  // 4. 開|關 所有設施 checkbox
  const [toggle_Boo, set_Toggle_Boo] = useState(false);
  const toggle_Facility = () => {
    set_Toggle_Boo(!toggle_Boo);
  }


  return <>
    <div className="space-y-2">
      {facility_Arr.map((item, index) => {
        return <div key={index}>
        { 
          /* 顯示4個 Facility 或 全部顯示 */
          <label className={`flex items-center gap-2 ${toggle_Boo === true ? '' : index >=4 ? 'hidden' : '' }`} key={index}>
            <input type="checkbox" className="w-4 h-4 rounded border-gray" name="facility" value={item}
            onChange={(event) => handel_Facility(event.target.value, event.target.checked)}
            checked={redux_Facility.includes(item)}/>            
            <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
          </label>
        }
        </div>
      })}
      <span onClick={toggle_Facility} className="text-primary cursor-pointer">{toggle_Boo ? "Hide" : "Show All"}</span>
    </div>
  </>
}