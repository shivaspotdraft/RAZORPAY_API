import { test, expect } from '../../fixtures/context'
import { createCustomer } from '../../helper/createCustomer'
import { customerDetails, customerErrors, fetchCustomersData } from '../../test-data/testData'
import { customerResponseSchema } from '../../schemas/customerSchema'

test('should fetch all customers successfully', async ({ apictx }) => {
  const fetchAllResponse = await apictx.get('/v1/customers')
  expect(fetchAllResponse).toBeOK()
  const customersList = await fetchAllResponse.json()
  expect(customersList).toBeTruthy()
  expect(typeof customersList.count).toBe('number')
  expect(customersList.items).toBeTruthy()
})

test('should fetch the requested number of customers when count is provided', async ({ apictx }) => {
  const fetchByCountResponse = await apictx.get('/v1/customers', {
    params: {
      count: fetchCustomersData.validCount
    }
  })

  expect(fetchByCountResponse).toBeOK()
  const customersList = await fetchByCountResponse.json()
  expect(customersList).toBeTruthy()
  expect(customersList.count).toBe(fetchCustomersData.validCount)
  expect(customersList.items.length).toBe(fetchCustomersData.validCount)
})

test('should return 400 error when count is negative', async ({ apictx }) => {
  const negativeCountResponse = await apictx.get('/v1/customers', {
    params: {
      count: fetchCustomersData.invalidCount
    }
  })

  expect(negativeCountResponse.status()).toBe(400)
  const errorBody = await negativeCountResponse.json()
  expect(errorBody).toBeTruthy()
  expect(errorBody.error.code).toBe(customerErrors.badRequestCode)
  expect(errorBody.error.description).toBe(customerErrors.negativeCountDescription)
})

test('should fetch a customer by ID', async ({ apictx }) => {
  const createCustomerResponse = await createCustomer(apictx, customerDetails)
  expect(createCustomerResponse).toBeOK()
  const createdCustomer = await createCustomerResponse.json()
  const result= customerResponseSchema.safeParse(createdCustomer)
  expect(result.success).toBe(true)
  expect(createdCustomer.id).toBeTruthy()
  const customerId = createdCustomer.id

  const fetchCustomerResponse = await apictx.get(`/v1/customers/${customerId}`)
  expect(fetchCustomerResponse).toBeOK()
  const fetchedCustomer = await fetchCustomerResponse.json()
  const editedResultesult= customerResponseSchema.safeParse(createdCustomer)
  expect(editedResultesult.success).toBe(true)
  expect(fetchedCustomer.id).toBe(createdCustomer.id)
  expect(fetchedCustomer.name).toBe(createdCustomer.name)
})
