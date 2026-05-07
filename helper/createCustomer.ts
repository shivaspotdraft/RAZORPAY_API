import { APIRequestContext } from "@playwright/test";

export async function createCustomer(apictx:APIRequestContext,data:object){
   const response= await apictx.post('/v1/customers',{
    data:data
  })
  return response

}