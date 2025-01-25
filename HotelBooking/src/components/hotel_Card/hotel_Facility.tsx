import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FacilitySVG } from "../client_Svg/client_Svg";

export default function Hotel_Facility () {
  const redux_Hotel_Detail = useSelector((state: RootState) => state.hotel_Detail);


  return <>
  
  <div className="flex flex-wrap gap-2">
    {redux_Hotel_Detail?.facility_List?.map((facility, index) => {
      // return <div key={index} className="flex flex-col items-center">
        return <div className="flex justify-center items-center flex-wrap" key={index}>
          <div className="w-1/4 flex flex-col items-center">
            <div className="bg-softGray rounded-[2rem]">
              <FacilitySVG name={facility} className="w-12 md:w-24 h-auto p-3"></FacilitySVG>
            </div>
            <p className="text-sm" key={index}> {facility.charAt(0).toUpperCase() + facility.slice(1)} </p>
          </div>
        </div>
        {/* <div className="flex justify-between">
          <div className="flex gap-2">
            <FacilitySVG name={"tick-primary"} className="w-4 h-auto "></FacilitySVG>
            <p className="text-sm" key={index}> {facility.charAt(0).toUpperCase() + facility.slice(1)} </p>
          </div>
        </div> */}
      // </div>
    })}
  </div>
  
  </>
}