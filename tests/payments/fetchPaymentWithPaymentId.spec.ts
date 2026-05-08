import { test, expect } from '../../fixtures/context'
import { paymentData, paymentErrors } from '../../test-data/testData'
import { paymentsScehma } from '../../schemas/paymentsSchema'
test('should fetch a payment by valid ID', async ({ apictx }) => {
  const fetchPaymentResponse = await apictx.get(`/v1/payments/${paymentData.id}`)
  expect(fetchPaymentResponse).toBeOK()
  const fetchedPayment = await fetchPaymentResponse.json()
  const result= paymentsScehma.safeParse(fetchedPayment)
  expect(result.success).toBe(true)
  expect(fetchedPayment.id).toBe(paymentData.id)
  expect(fetchedPayment.amount).toBe(paymentData.amount)
  expect(fetchedPayment.method).toBe(paymentData.method)
  expect(fetchedPayment.status).toBe(paymentData.status)
})

test('should return 400 when fetching a payment with an invalid ID', async ({ apictx }) => {
  const invalidPaymentId = `payments${Date.now()}`
  const fetchPaymentResponse = await apictx.get(`/v1/payments/${invalidPaymentId}`)
  expect(fetchPaymentResponse.status()).toBe(400)
  const errorBody = await fetchPaymentResponse.json()
  expect(errorBody.error.code).toBe(paymentErrors.badRequestCode)
  expect(errorBody.error.description).toBe(paymentErrors.invalidIdDescription)
  expect(errorBody.error.reason).toBe(paymentErrors.inputValidationFailedReason)
})
