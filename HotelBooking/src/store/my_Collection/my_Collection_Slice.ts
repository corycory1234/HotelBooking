import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { add_Hotel_Detail_Interface } from "@/types/add_Hotel_Detail";
import { Collection_Interface, Collection_List_Interface } from "@/types/my_Collection_List";

// interface My_Collection_Interface {
//   my_Collection_List: add_Hotel_Detail_Interface[]
// };

// const initialState: My_Collection_Interface = {
//   my_Collection_List: [],
// };

const initialState: Collection_List_Interface = {
  collection_List: []
}


const my_Collection_Slice = createSlice({
  name: "my_Collection",
  initialState,
  reducers: {
    // 1. 空陣列 > 更新已收藏之陣列
    update_My_Collection: (state, action: PayloadAction<Collection_Interface []>) => {
      state.collection_List = action.payload
    },

    // 3. 新增收藏飯店
    add_My_Collection: (state, action: PayloadAction<Collection_Interface>) => {
      // 3.1 不可以直接修改action.Payload傳進來的物件, 因此我們要先展開運算子
      // 3.2 由於我們要 isCollected 變 true, 才顯示實心愛心, 因此必須展開運算子
      const the_Collected_Hotel = {...action.payload, isCollected: true}; 
      console.log(the_Collected_Hotel, "看看是誰被收藏");
      // the_Collected_Hotel.isCollected = true; // 空愛心 >> 實心愛心
      state.collection_List.unshift(the_Collected_Hotel);
      console.log(state.collection_List, "查看Redux 我的收藏");
    },

    // 4. 刪除收藏飯店
    delete_My_Collection: (state, action: PayloadAction<Collection_Interface>) => {
      const the_Deleted_Hotel = action.payload;
      state.collection_List = state.collection_List.map((item) => {
        if(item.hotel_Id === the_Deleted_Hotel.hotel_Id) {
          return {...item, isCollected: false}
        };
        return item;
      });
      state.collection_List = state.collection_List.filter((item) => item.hotel_Id !== the_Deleted_Hotel.hotel_Id);
    }


  }
});

export const {update_My_Collection, add_My_Collection, delete_My_Collection} = my_Collection_Slice.actions;
export default my_Collection_Slice.reducer;