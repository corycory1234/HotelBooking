import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateRangeSlider } from "@/store/form-Search/formSearchSlice";
import { Slider } from "@nextui-org/slider";

export default function Client_RangeSlider () {
  // 1. Redux 透過 dispatch 拿取 Redux 之函式
  const dispatch: AppDispatch = useDispatch();

  // 2. Redudx 取 rangeSlider 初始值
  const redux_RangeSlider = useSelector((state: RootState) => state.formSearch.rangeSlider);

  // 3. 最小價錢 與 最大價錢陣列 - Range Slider
  const handle_RangeSlider = (newValue: number | number[]) => {
    dispatch(updateRangeSlider(newValue))
  };
  
  return <>
  
    <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
      <Slider
        name="rangeslider"
        className=""
        formatOptions={{style: "currency", currency: "USD"}}
        label=" "
        maxValue={9999}
        minValue={0}
        step={100}
        value={redux_RangeSlider}
        onChange={handle_RangeSlider}
        // getValue={(value) => {
        //   if (Array.isArray(value)) {
        //     return value.map(v => Math.round(v)).join(' – ');
        //   }
        //   return Math.round(value).toString();
        // }}
      />
    </div>
  </>
}