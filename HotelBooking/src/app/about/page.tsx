import Previous_Page from "@/components/previous_Page/previous_Page";
import { OtherSVG } from "@/components/client_Svg/client_Svg";

export default function About () {
  // 1. 當前頁面
  const current_Page_Name = "About US";


  return <div className="pb-20">
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
      <div className="flex justify-center">
        
      </div>

    <div className="flex flex-col items-center gap-4 customized-bg-gradient p-4">
    <img src="/Logo.svg" alt=""  className="w-1/2"/>


      <div className="flex flex-col gap-2 bg-white rounded p-4">
        <p className="font-semibold">About Us</p>
        <p>Go Tour is your trusted travel companion since 2018. We're dedicated to making travel planning seamless and enjoyable. Our platform connects travelers with exceptional experiences, curated deals, and personalized service to create unforgettable journeys.</p>
      </div>

      <div className="flex gap-2 w-full">
        <div className="w-1/2 flex flex-col items-center bg-white rounded p-4">
          <p className="text-3xl">6 +</p>
          <p className="text-center text-gray">Years of Service</p>
        </div>
        <div className="w-1/2 flex flex-col items-center bg-white rounded p-4">
          <p className="text-3xl">2M +</p>
          <p className="text-center text-gray">Happy Travelers</p>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <div className="w-1/2 flex flex-col items-center bg-white rounded p-4">
          <p className="text-3xl">150 +</p>
          <p className="text-center text-gray">Destinations</p>
        </div>
        <div className="w-1/2 flex flex-col items-center bg-white rounded p-4">
          <p className="text-3xl">500 +</p>
          <p className="text-center text-gray">Partners</p>
        </div>
      </div>



      <div className="flex flex-col gap-4 bg-white rounded p-4 w-full">
        <p className="font-semibold">Our Services</p>
        <div className="flex flex-wrap gap-y-4">
          <div className="w-1/2 flex flex-col items-center gap-2">
            <OtherSVG name="tourplan" className="w-8 h-auto"></OtherSVG>
            <p>Tour Planning</p>
          </div>
          <div className="w-1/2 flex flex-col items-center gap-2">
            <OtherSVG name="booking" className="w-6 h-auto"></OtherSVG>
            <p>Instant Booking</p>
          </div>
          <div className="w-1/2 flex flex-col items-center gap-2">
            <OtherSVG name="specials" className="w-6 h-auto"></OtherSVG>
            <p>Special Deals</p>
          </div>
          <div className="w-1/2 flex flex-col items-center gap-2">
            <OtherSVG name="24hr" className="w-6 h-auto"></OtherSVG>
            <p>7/24 Support</p>
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-4 bg-white rounded p-4 w-full">
        <p className="font-semibold">Contact Us</p>
        <div className="flex gap-2">
          <OtherSVG name="phone" className="w-5 h-auto"></OtherSVG>
          <p>+1 (888) 123-4567</p>
        </div>
        <div className="flex gap-2">
        <OtherSVG name="email" className="w-5 h-auto"></OtherSVG>
          <p>support@gotour.com</p>
        </div>

        <div className="flex gap-2">
          <OtherSVG name="location" className="w-5 h-auto"></OtherSVG>
          <p className="w-1/2">123 Travel Street, San Francisco, CA 94105</p>
        </div>
      </div>





    </div>
  </div>
}