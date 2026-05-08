import {z} from 'zod'

export const orderSchema= z.object({
    id: z.string().startsWith('order_'),
    amount: z.number().positive(),
    currency: z.string(),
    status: z.string(),
    receipt: z.string().nullable()
})