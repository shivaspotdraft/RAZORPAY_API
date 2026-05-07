import { test, expect } from '../../fixtures/context'
import { orderID, paymentErrors } from '../../test-data/testData'

test('should fetch payments for a valid order ID', async ({ apictx }) => {
  const fetchPaymentsResponse = await apictx.get(`/v1/orders/${orderID.id}/payments`)
  expect(fetchPaymentsResponse).toBeOK()
  const paymentsList = await fetchPaymentsResponse.json()
  expect(paymentsList.entity).toBe('collection')
  expect(paymentsList.items).toBeTruthy()
})

test('should return 404 when fetching payments for an invalid order ID', async ({ apictx }) => {
  const invalidOrderId = `order${Date.now()}`
  const fetchPaymentsResponse = await apictx.get(`/v1/orders/${invalidOrderId}/payments`)
  expect(fetchPaymentsResponse.status()).toBe(404)
  const errorBody = await fetchPaymentsResponse.json()
  expect(errorBody.message).toBe(paymentErrors.noRouteMatchedMessage)
})
