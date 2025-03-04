export interface Form_Search_Interface {
  keyword: string,
  dateRange: string | null,
  start_Date: Date | null | string,
  end_Date: Date | null | string,
  // dateRange: DateValueType,
  room: number,
  adult: number,
  child: number,
  rangeSlider: number | number[],
  bedType: string[] | null,
  rating: number[] | null,
  facility: string[] | null,
}