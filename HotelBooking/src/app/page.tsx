// 'use client';
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../store/store";
import Carousel_Popular_Destination from "../components/home/carousel_Popular_Destination";
import Carousel_Near from "../components/home/client-Carousel-Near";
import Carousel_Offer from "@/components/home/carousel_Offers";
import Menu from "../components/menu";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
// import Server_Form_Search from "../components/server-Form-Search/server-Form-Search";
import Index_Form_Search from "../components/form_Search/index_Form_Search";
import Link from "next/link";
import Avatar from "@/components/avatar/avatar";

export default function Home() {
  // const dispatch: AppDispatch = useDispatch();


  return <>

      <div className="bg-home-explore lg:bg-home-explore-desktop w-full h-52 lg:h-[20rem] bg-no-repeat bg-cover bg-center">
          {/* <Menu></Menu> */}
        <Nav></Nav>
        <Avatar></Avatar>

        


        {/* 上層 BG圖 */}
        <div className="flex p-4 lg:px-[8.5%]">
          <div className="basis-1/2 flex flex-col">
            <h1 className="text-[24px] text-white font-semibold">Let's Explore The World!</h1>
            {/* <div className="flex gap-1">
              <img src="/home/Location.svg" alt="" />
              <p className="text-[8px] text-white">You're in Dhaka</p>
            </div> */}
          </div>
        </div>
        {/* 上層 BG圖 */}
        
        {/* Swiper 輪播圖 */}
        <div className="min-h-screen w-full my-bg-gradient lg:bg-none lg:w-5/6 lg:mx-auto flex flex-col">
          <div className="lg:bg-white lg:rounded-lg">
            {/* 這個組件裡面有三個 hidden input: room, adult, child */}
            <Index_Form_Search></Index_Form_Search>
            {/* 這個組件裡面有三個 hidden input: room, adult, child */}
          </div>

          <div className="flex flex-col p-4 gap-4 pb-20 lg:px-0">
            <h2 className="font-bold">Popular Destinations</h2>
            <div className="">
              <Carousel_Popular_Destination></Carousel_Popular_Destination>
            </div>

            <h2 className="font-bold">Promotions</h2>
            <div className="">
              <Carousel_Offer></Carousel_Offer>
            </div>

            <h2 className="font-bold">Hotels Near You</h2>
            <div className="">
              <Carousel_Near></Carousel_Near>
            </div>
          </div>
          
          {/* <div className="hidden lg:block lg:border-b lg:border-softGray"></div> */}


            <Footer></Footer>

        </div>
        {/* Swiper 輪播圖 */}



    </div>
    <div className="lg:hidden">
      <Menu></Menu>
    </div>
    </>
  ;
}
