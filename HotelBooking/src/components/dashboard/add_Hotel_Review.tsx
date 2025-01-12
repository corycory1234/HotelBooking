'use Client';
import { useState } from "react";

export default function Add_Hotel_Review () {
    // 2. 留言日期
    const [date, set_Date] = useState((new Date()).toLocaleDateString());
    // console.log(date, "今天");
    
  return <>
    {/** 旅客留言、評價 */}
    <div className="flex flex-col gap-2">
        <p className="font-semibold text-primary">Comment</p>
        <div className="flex gap-2">
          <label htmlFor="travelername">Name</label>
          <input type="text" id="travelername" name="travelername" className="border rounded"/>
          <label htmlFor="date">Date</label>
          <input type="text" readOnly id="date" name="date" className="border rounded" value={date}/>
          <label htmlFor="rating">Rating</label>
          <select name="rating" id="rating" className="border rounded">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <textarea name="comment" id="comment" className="border rounded"></textarea>
      </div>
      {/** 旅客留言、評價 */}
  </>
}