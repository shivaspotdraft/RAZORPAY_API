import {z} from 'zod'
export const customerResponseSchema = z.object({
 id: z.string().startsWith('cust_'),
 name:z.string().nullable(),
 email: z.email().nullable(),
 contact:z.string().nullable()

}).loose()