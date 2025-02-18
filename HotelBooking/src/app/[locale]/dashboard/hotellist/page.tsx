import Side_Bar from "@/components/dashboard/side_Bar";
import Hotel_List_Content from "@/components/dashboard/hotellist/hotel_List_Content";

export default function Hotel_List_Dashboard () {
  return <div className="flex ">
    <div className=" basis-2/12 flex flex-col">
      <Side_Bar></Side_Bar>
    </div>

    <div className=" basis-10/12">


      {/** 顯示2筆飯店，可編輯刪除 */}
      <Hotel_List_Content></Hotel_List_Content>
      {/** 顯示2筆飯店，可編輯刪除 */}

  
    </div>

  

</div>
}