import BackPage from "@/components/back-Page/backPage"
export default function HotelList () {

  return <>
  <title>HOTEL</title>
    <nav className="fixed top-0 left-0 right-0 bg-primary z-50 border-b border-gray-100">
      <div className="px-4 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackPage></BackPage>
          <button className="text-gray-700"><i className="fas fa-arrow-left"></i></button>
          <h1 className="text-lg font-medium">Hotels</h1>
        </div>
        <button className="text-gray-700"><i className="fas fa-search"></i></button>
      </div>
    </nav>

    
<div className="fixed top-[56px] left-0 right-0 bg-white z-40 border-b border-gray-100">
  <div className="p-4">
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
  </div>
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
      <img src="https://creatie.ai/ai/api/search-image?query=luxury modern hotel room interior with ocean view, featuring elegant furniture, king size bed, floor-to-ceiling windows, neutral color palette with blue accents, professional photography style&width=600&height=400&orientation=landscape&flag=05ab9dae-5670-4084-8ff1-001812c192c2&flag=76681bee-9a6b-49d1-b496-5e22fe8c1f27" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
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
      <img src="https://creatie.ai/ai/api/search-image?query=luxurious boutique hotel suite with city skyline view, contemporary design, lounge area, marble bathroom, warm lighting, professional interior photography&width=600&height=400&orientation=landscape&flag=d1e4eee2-19c0-4ff1-8ad1-91d65fc8cde5&flag=4aca557a-2a25-4497-9265-f06a917226c5" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
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
      <img src="https://creatie.ai/ai/api/search-image?query=modern luxury hotel room with panoramic mountain views, minimalist design, premium bedding, wooden elements, ambient lighting, professional real estate photography&width=600&height=400&orientation=landscape&flag=74993b8c-6742-45b8-9adc-a4c0e7709639&flag=6e9dacaf-7517-4ea2-ac8a-fcf95bab3e45" alt="Hotel Room" className="w-full h-[200px] object-cover object-top"/>
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