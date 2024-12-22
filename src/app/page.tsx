// 'use client';
// import { useDispatch, useSelector } from "react-redux";
// import { increase, decrease, increaseByAmount } from "@/store/test/testSlice";
import { RootState, AppDispatch } from "@/store/store";
import Carousel_Offer from "@/components/home/client-Carousel-Offer";
import Carousel_Near from "@/components/home/client-Carousel-Near";
import Menu from "@/components/menu";
import Client_Form_Search from "@/components/client-Form-Search/client-Form-Search";

export default function Home() {
  // const dispatch: AppDispatch = useDispatch();

  // 1. testSlice 的 number 初始值
  // const number = useSelector((state: RootState) => state.number.value);
  

  return <>
      <div className="bg-home-explore w-full h-52 lg:h-64 bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between p-4">
          <img src="/menu/Menu.svg" alt="" />
          <img src="/account/Avatar.png" alt="" />
        </div>

        


        {/* 上層 BG圖 */}
        <div className="flex p-4">
          <div className="basis-1/2 flex flex-col">
            <h1 className="text-[24px] text-white font-semibold">Let's Explore The World!</h1>
            <div className="flex gap-1">
              <img src="/home/Location.svg" alt="" />
              <p className="text-[8px] text-white">You're in Dhaka</p>
            </div>
          </div>
        </div>
        {/* 上層 BG圖 */}
        
        {/* Swiper 輪播圖 */}
        <div className="bg-white rounded-t-3xl h-screen w-full bg-gradient-to-b from-[#F9F9F9] to-slate-50">
          <div className="">
            <Client_Form_Search></Client_Form_Search>
          </div>

          <div className="flex flex-col p-4 gap-4">
            <h2>Popular Offer</h2>
            <div className="flex">
              <Carousel_Offer></Carousel_Offer>
            </div>
            <h2>Hotels Near You</h2>
            <div className="bg-white rounded-t-xl p-1">
              <Carousel_Near></Carousel_Near>
            </div>
          </div>
        </div>
        {/* Swiper 輪播圖 */}



    </div>
    <Menu></Menu>


    
    {/* <div className="flex justify-center items-center gap-5 h-screen z-10">

      <h1>{number}</h1>
      <button onClick={()=> dispatch(increase())} className="px-3 bg-orange-500 rounded">加加</button>
      <button onClick={()=> dispatch(decrease())} className="px-3 bg-green-500 rounded">減減</button>
      <button onClick={()=> dispatch(increaseByAmount(10))} className="px-3 bg-purple-500 rounded">一次加10</button>
    </div> */}

    </>
  ;
}
