'use Client';
import { useEffect, useState } from "react";
import { create_Review_Interface } from "@/types/create_Hotel";
import { v4 as uuidv4 } from 'uuid';

export default function Add_Hotel_Review () {
    // 2. 留言日期
    // const [date, set_Date] = useState((new Date()).toLocaleDateString());
    // console.log(date, "今天");
    
    // 1.
    const [review_List, set_Review_List] = useState<create_Review_Interface[]>([]);
    const add_Review = (event?: any) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      set_Review_List([...review_List, {
        traveler_Id: uuidv4(), // 使用 UUID 生成唯一 ID
        traveler_Name: "",
        date: "",
        traveler_Rating: null,
        comment: "",
        reply: "",
      }])
    };

    useEffect(() => {
      add_Review();
    },[]);
    useEffect(() => {
      console.log(review_List, "查看評論陣列");
    },[review_List])


    // 7. 旅客評論&飯店回覆 onChange 變更
    const handle_Review_List_Change = (index: number, field: keyof create_Review_Interface, value: any) => {
      const update_Review_List = review_List.map((item, i) => 
        i === index ? {...item, [field]: value} : item
      );
      set_Review_List(update_Review_List)
    }

  return <>
    {/** 旅客留言、評價 */}
    <div className="flex flex-col gap-2">
        <p className="font-semibold text-primary">Comment</p>
        <button onClick={(event) => add_Review(event)} className="bg-primary rounded">再新增一個評論</button>
        {review_List.map((item, index) => {
          return <div key={index}>
          
            <div className="flex gap-2">
              <label htmlFor="travelername">Name</label>
              <input type="text" id={`${index}travelername`} name={`${index}travelername`} className="border rounded" 
                onChange={(event) => handle_Review_List_Change(index, "traveler_Name", event.target.value)} value={item.traveler_Name}/>
              <label htmlFor="date">Date</label>
              <input type="date" id={`${index}date`} name={`${index}date`} className="border rounded" value={item.date}
                onChange={(event) => handle_Review_List_Change(index, "date", event.target.value)}/>
              <label htmlFor="rating">Rating</label>
              <select name={`${index}rating`} id={`${index}rating`} className="border rounded" value={item.traveler_Rating as number}
                onChange={(event) => handle_Review_List_Change(index, "traveler_Rating", event.target.value)}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <textarea name={`${index}comment`} id={`${index}comment`} className="border rounded w-full" rows={4} value={item.comment}
              onChange={(event) => handle_Review_List_Change(index, "comment", event.target.value)}></textarea>
            
            <label className="font-semibold text-primary">Reply</label>
            <textarea name={`${index}reply`} id={`${index}reply`}className="border rounded w-full" rows={4} value={item.reply as string}
              onChange={(event) => handle_Review_List_Change(index, "reply", event.target.value)}></textarea>
          
          </div>
        })}

      </div>
      {/** 旅客留言、評價 */}
  </>
}