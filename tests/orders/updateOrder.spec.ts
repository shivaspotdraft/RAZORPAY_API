import { test, expect } from '../../fixtures/context'
import { createOrder } from '../../helper/createorder'
import { invalidOrderUpdate, orderDetails, orderErrors, updateOrderNotes } from '../../test-data/testData'

test('should update an order with valid data', async ({ apictx }) => {
  const createOrderResponse = await createOrder(apictx, orderDetails)
  expect(createOrderResponse).toBeOK()
  const createdOrder = await createOrderResponse.json()
  const orderId = createdOrder.id

  const updateOrderResponse = await apictx.patch(`/v1/orders/${orderId}`, {
    data: updateOrderNotes
  })

  expect(updateOrderResponse).toBeOK()
  const updatedOrder = await updateOrderResponse.json()
  expect(updatedOrder.id).toBe(orderId)
  expect(updatedOrder.notes.notes_key_1).toBe(updateOrderNotes.notes.notes_key_1)
  expect(updatedOrder.notes.notes_key_2).toBe(updateOrderNotes.notes.notes_key_2)
})

test('should return 400 when updating an order with a disallowed field', async ({ apictx }) => {
  const createOrderResponse = await createOrder(apictx, orderDetails)
  expect(createOrderResponse).toBeOK()
  const createdOrder = await createOrderResponse.json()
  const orderId = createdOrder.id

  const updateOrderResponse = await apictx.patch(`/v1/orders/${orderId}`, {
    data: invalidOrderUpdate
  })

  expect(updateOrderResponse.status()).toBe(400)
  const errorBody = await updateOrderResponse.json()
  expect(errorBody.error.code).toBe(orderErrors.badRequestCode)
  expect(errorBody.error.description).toContain(orderErrors.extraFieldDescription)
  expect(errorBody.error.reason).toBe(orderErrors.extraFieldSentReason)
})
