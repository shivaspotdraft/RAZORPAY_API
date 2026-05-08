import { test, expect } from '../../fixtures/context'
import { paymentData, paymentErrors, updatePaymentNotes } from '../../test-data/testData'
import { paymentsScehma } from '../../schemas/paymentsSchema'
test.describe.configure({ mode: 'serial' })

test('should update a payment with valid notes', async ({ apictx }) => {
  const updatePaymentResponse = await apictx.patch(`/v1/payments/${paymentData.id}`, {
    data: updatePaymentNotes
  })

  expect(updatePaymentResponse).toBeOK()
  const updatedPayment = await updatePaymentResponse.json()
  const result= paymentsScehma.safeParse(updatedPayment)
  expect(result.success).toBe(true)
  expect(updatedPayment.id).toBe(paymentData.id)
  expect(updatedPayment.notes.notes_key_1).toBe(updatePaymentNotes.notes.notes_key_1)
  expect(updatedPayment.notes.notes_key_2).toBe(updatePaymentNotes.notes.notes_key_2)
})

test('should return 400 when updating payment with a disallowed field', async ({ apictx }) => {
  const updatePaymentResponse = await apictx.patch(`/v1/payments/${paymentData.id}`, {
    data: {
      amount: paymentData.amount
    }
  })

  expect(updatePaymentResponse.status()).toBe(400)
  const errorBody = await updatePaymentResponse.json()
  expect(errorBody.error.code).toBe(paymentErrors.badRequestCode)
  expect(errorBody.error.description).toBe(paymentErrors.extraFieldDescription)
})
