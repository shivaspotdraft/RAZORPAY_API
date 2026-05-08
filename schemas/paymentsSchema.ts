import {z} from 'zod'

export const paymentsScehma= z.object({
    id:z.string().startsWith('pay_'),
    amount:z.number().positive(),
    method:z.string(),
    status: z.enum(['created', 'authorized', 'captured', 'refunded', 'failed'])
})