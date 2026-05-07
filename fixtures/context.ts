import {APIRequestContext, test as base,request} from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config();

if (!process.env.Base_URL) {
    throw new Error('Base_URL is not defined in the .env file')
}

type myFixtures={
    apictx:APIRequestContext
}
 export const test= base.extend<myFixtures>({
    apictx:async({},use)=>{
        const creds= Buffer.from(`${process.env.Test_Key_ID}:${process.env.Test_Key_Secret}`).toString("base64")
        const ctx= await request.newContext({
          baseURL: process.env.Base_URL,
          extraHTTPHeaders:{
            'Content-Type':'application/json',
            'Authorization':`Basic ${creds}`
          }
        })
        await use (ctx)
        await ctx.dispose()


    }
 })
 export {expect} from '@playwright/test'