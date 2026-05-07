import { test, expect } from '../../fixtures/context'
import { fetchPaymentsData, paymentErrors } from '../../test-data/testData'

test('should fetch all payments', async ({ apictx }) => {
  const fetchAllPaymentsResponse = await apictx.get('/v1/payments/')
  expect(fetchAllPaymentsResponse).toBeOK()
  const paymentsList = await fetchAllPaymentsResponse.json()
  expect(typeof paymentsList.count).toBe('number')
  expect(paymentsList.items.length).toBe(paymentsList.count)
})

test('should fetch the requested number of payments when count is provided', async ({ apictx }) => {
  const fetchByCountResponse = await apictx.get('/v1/payments/', {
    params: {
      count: fetchPaymentsData.validCount
    }
  })
  expect(fetchByCountResponse).toBeOK()
  const paymentsList = await fetchByCountResponse.json()
  expect(typeof paymentsList.count).toBe('number')
  expect(paymentsList.items.length).toBe(paymentsList.count)
})

test('should return 400 when fetching payments with count below the minimum', async ({ apictx }) => {
  const invalidCountResponse = await apictx.get('/v1/payments/', {
    params: {
      count: fetchPaymentsData.invalidCount
    }
  })
  expect(invalidCountResponse.status()).toBe(400)
  const errorBody = await invalidCountResponse.json()
  expect(errorBody.error.code).toBe(paymentErrors.badRequestCode)
  expect(errorBody.error.description).toBe(paymentErrors.countBelowMinDescription)
})
