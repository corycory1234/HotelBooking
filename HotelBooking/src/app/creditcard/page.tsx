import Previous_Page from "@/components/previous_Page/previous_Page";
import Credit_Card_List from "@/components/credit_Card/credit_Card_List";
import Form_Credit_Card from "@/components/credit_Card/form_Credit_Card";

export default function CreditCard() {
  // 1. 當前頁面 - 頂端文字，props傳遞給 <Previous_Page>
  const current_Page_Name = "Checkout"

  return <div>
    {/** 回上一頁 */}
    <Previous_Page current_Page_Name={current_Page_Name}></Previous_Page>
    {/** 回上一頁 */}
    
    {/** 選信用卡 */}
    <Credit_Card_List></Credit_Card_List>
    {/** 選信用卡 */}

    {/** <form>刷信用卡表單 */}
    <Form_Credit_Card></Form_Credit_Card>
    {/** <form>刷信用卡表單 */}
    
  </div>
}