import { APIRequestContext } from "@playwright/test";
export async function createOrder(apictx:APIRequestContext,data?:object){
   const response= await apictx.post('/v1/orders',{
        data:data
    })

    return response
}