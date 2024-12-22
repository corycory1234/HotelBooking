'use server';

import { revalidatePath } from "next/cache";

export async function Submit_Search(formData: FormData) {
  const destination = formData.get("destination") as string;
  const dateRange = formData.get("datepicker") as string;
  const room = formData.get("room");
  const adult = formData.get("adult");
  const child = formData.get("child");
  console.log(destination);
  console.log(dateRange);
  console.log(room, adult, child);
  
}