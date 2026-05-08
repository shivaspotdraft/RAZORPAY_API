import { test, expect } from '../../fixtures/context'
import { createCustomer } from '../../helper/createCustomer'
import { customerDetails, updatedCustomerName, updatedCustomerEmailDomain } from '../../test-data/testData'
import { customerResponseSchema } from '../../schemas/customerSchema'

test('should edit customer with valid data', async ({ apictx }) => {
  const createCustomerResponse = await createCustomer(apictx, customerDetails)
  expect(createCustomerResponse).toBeOK()
  const createdCustomer = await createCustomerResponse.json()
  const result= customerResponseSchema.safeParse(createdCustomer)
  expect(result.success).toBe(true)
  const updatedCustomerData = {
    ...customerDetails,
    name: updatedCustomerName,
    email: `ram_${Date.now()}@${updatedCustomerEmailDomain}`
  }

  const editCustomerResponse = await apictx.put(`/v1/customers/${createdCustomer.id}`, {
    data: updatedCustomerData
  })

  expect(editCustomerResponse).toBeOK()
  const editedCustomer = await editCustomerResponse.json()
  const editedResult= customerResponseSchema.safeParse(createdCustomer)
  expect(editedResult.success).toBe(true)
  expect(editedCustomer.id).toEqual(createdCustomer.id)
  expect(editedCustomer.name).toBe(updatedCustomerData.name)
  expect(editedCustomer.email).toBe(updatedCustomerData.email)
})
