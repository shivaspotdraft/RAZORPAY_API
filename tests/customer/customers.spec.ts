import { test, expect } from '../../fixtures/context'
import { createCustomer } from '../../helper/createCustomer'
import { customerDetails, customerErrors, invalidCustomerEmail } from '../../test-data/testData'

test('should create a customer with valid data', async ({ apictx }) => {
  const createCustomerResponse = await createCustomer(apictx, customerDetails)
  expect(createCustomerResponse).toBeOK()
  const createdCustomer = await createCustomerResponse.json()
  expect(createdCustomer.id).toBeTruthy()
  expect(createdCustomer.name).toBe(customerDetails.name)
  expect(createdCustomer.email).toBe(customerDetails.email)
  expect(createdCustomer.contact).toBe(customerDetails.contact)
})

test('should return 400 when creating a customer with invalid email', async ({ apictx }) => {
  const customerWithInvalidEmail = {
    ...customerDetails,
    email: invalidCustomerEmail
  }
  const createCustomerResponse = await createCustomer(apictx, customerWithInvalidEmail)
  expect(createCustomerResponse.status()).toBe(400)
  const errorBody = await createCustomerResponse.json()
  expect(errorBody.error).toBeTruthy()
  expect(errorBody.error.code).toBe(customerErrors.badRequestCode)
  expect(errorBody.error.description).toBe(customerErrors.invalidEmailDescription)
})

test("should return 400 when creating a duplicate customer with fail_existing set to '1'", async ({ apictx }) => {
  const customerWithFailExisting = {
    ...customerDetails,
    fail_existing: '1'
  }

  const createDuplicateResponse = await createCustomer(apictx, customerWithFailExisting)
  const errorBody = await createDuplicateResponse.json()
  expect(createDuplicateResponse.status()).toBe(400)
  expect(errorBody.error).toBeTruthy()
  expect(errorBody.error.code).toBe(customerErrors.badRequestCode)
  expect(errorBody.error.description).toBe(customerErrors.duplicateCustomerDescription)
})

test("should return existing customer when creating duplicate with fail_existing set to '0'", async ({ apictx }) => {
  const uniqueSuffix = Date.now()
  const uniqueCustomer = {
    ...customerDetails,
    email: `dup_${uniqueSuffix}@example.com`,
    contact: `9${String(uniqueSuffix).slice(-9)}`
  }

  const firstCreateResponse = await createCustomer(apictx, uniqueCustomer)
  expect(firstCreateResponse).toBeOK()
  const firstCreatedCustomer = await firstCreateResponse.json()

  const duplicateCreateResponse = await createCustomer(apictx, uniqueCustomer)
  const duplicateCreatedCustomer = await duplicateCreateResponse.json()

  expect(duplicateCreateResponse).toBeOK()
  expect(duplicateCreatedCustomer).toBeTruthy()
  expect(duplicateCreatedCustomer.id).toBe(firstCreatedCustomer.id)
  expect(duplicateCreatedCustomer.name).toBe(uniqueCustomer.name)
  expect(duplicateCreatedCustomer.email).toBe(uniqueCustomer.email)
  expect(duplicateCreatedCustomer.contact).toBe(uniqueCustomer.contact)
})
