import BackPage from "@/components/back-Page/backPage";
import Server_Form_Search from "@/components/server-Form-Search/server-Form-Search";

export default function HotelList () {

  return <>
  <title>HOTEL</title>
    <BackPage></BackPage>


<div className="fixed top-[56px] left-0 right-0 bg-white z-40 border-b border-gray-100">
  {/* <Server_Form_Search></Server_Form_Search> */}
  {/* <div className="p-4">
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
      <i className="fas fa-location-dot text-gray-400"></i>
      <input type="text" placeholder="Location" className="bg-transparent border-none w-full text-sm placeholder:text-gray-400"/>
    </div>
    <div className="flex gap-3 mt-3">
      <div className="flex-1">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <i className="fas fa-calendar text-gray-400"></i>
          <input type="date" className="bg-transparent border-none w-full text-sm"/>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <i className="fas fa-calendar text-gray-400"></i>
          <input type="date" className="bg-transparent border-none w-full text-sm"/>
        </div>
      </div>
    </div>
  </div> */}
  <div className="px-4 pb-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
    <button className="flex items-center gap-2 px-3 py-1.5 bg-custom text-white rounded-full text-sm !rounded-button">
      <i className="fas fa-filter"></i>
      <span>Filters</span>
    </button>
    <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded-full text-sm !rounded-button">5 Star</button>
    <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded-full text-sm !rounded-button">Pool</button>
    <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded-full text-sm !rounded-button">Spa</button>
    <button className="whitespace-nowrap px-3 py-1.5 border border-gray-200 rounded-full text-sm !rounded-button">Beach</button>
  </div>
</div>
<main className="mt-[190px] px-4 pb-4">
  <div className="flex items-center justify-between mb-4">
    <p className="text-sm text-gray-500">245 hotels found</p>
    <select className="text-sm border-none bg-transparent">
      <option>Sort by: Recommended</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
      <option>Guest Rating</option>
    </select>
  </div>
  <div className="space-y-4">
    <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src="/hotellist/hotellist_1.webp" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">The Ritz-Carlton</h3>
            <p className="text-sm text-gray-500 mt-1">Downtown • 0.5 mi from center</p>
          </div>
          <div className="flex items-center gap-1 bg-custom/10 text-custom px-2 py-1 rounded">
            <i className="fas fa-star text-xs"></i>
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Pool</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Spa</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Restaurant</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-semibold">$599</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
          <button className="bg-custom text-white px-4 py-2 rounded-lg text-sm font-medium !rounded-button">Book Now</button>
        </div>
      </div>
    </article>
    <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src="/hotellist/hotellist_2.webp" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Four Seasons Hotel</h3>
            <p className="text-sm text-gray-500 mt-1">Waterfront • 1.2 mi from center</p>
          </div>
          <div className="flex items-center gap-1 bg-custom/10 text-custom px-2 py-1 rounded">
            <i className="fas fa-star text-xs"></i>
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Beach</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Gym</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Bar</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-semibold">$799</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
          <button className="bg-custom text-white px-4 py-2 rounded-lg text-sm font-medium !rounded-button">Book Now</button>
        </div>
      </div>
    </article>
    <article className="bg-white rounded-lg overflow-hidden shadow-sm">
      <img src="/hotellist/hotellist_3.webp" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Mandarin Oriental</h3>
            <p className="text-sm text-gray-500 mt-1">Marina Bay • 2.0 mi from center</p>
          </div>
          <div className="flex items-center gap-1 bg-custom/10 text-custom px-2 py-1 rounded">
            <i className="fas fa-star text-xs"></i>
            <span className="text-sm font-medium">4.7</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Pool</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">Spa</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">WiFi</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-semibold">$699</span>
            <span className="text-sm text-gray-500">/night</span>
          </div>
          <button className="bg-custom text-white px-4 py-2 rounded-lg text-sm font-medium !rounded-button">Book Now</button>
        </div>
      </div>
    </article>
  </div>
</main>

  </>
}