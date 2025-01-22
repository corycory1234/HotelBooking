import Previous_Page from "@/components/previous_Page/previous_Page";
import { OtherSVG } from "@/components/client_Svg/client_Svg";
import My_Collection_Json from "@/fakeData/my_Collection_List.json"

export default function My_Collection () {
  // 1. 當前頁面
  const current_Page_Name = "My Collection";


  return <div className={`customized-bg-gradient min-h-screen ${My_Collection_Json.length >0 ? 'pb-20' : ''}`}>
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>

    <div className="flex-1 flex flex-col gap-2 p-4">

      {/** 沒有我的最愛.SVG */}
      {My_Collection_Json.length <=0 ? <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <OtherSVG name="collection" className="w-10 h-auto"></OtherSVG>
          <p className="text-gray">You have No Collection</p>
        </div>
      
      
      : My_Collection_Json.map((item) => {
        {/** 有我的最愛 - 陣列 */}
        return <div className="relative" key={item.id}>
        
        <div className="absolute top-2 right-5 bg-softGray rounded-full cursor-pointer">
          <OtherSVG name="trashcan" className="w-7 h-auto"></OtherSVG>
        </div>


        <img src={item.images[0].url} alt={item.images[0].description} className="w-full rounded"/>
        <p className="absolute bottom-7 left-2 text-white font-semibold">{item.name}</p>
        <p className="absolute bottom-2 left-2 text-white font-semibold">{`${item.country}, ${item.city}`}</p>
        
        </div>
      })}
      {/** 有我的最愛 - 陣列 */}

    </div>
  </div>
}