import { test, expect } from '../../fixtures/context'
import { createOrder } from '../../helper/createorder'
import { orderAmountLimits, orderDetails, orderErrors } from '../../test-data/testData'

test('should create an order with valid data', async ({ apictx }) => {
  const createOrderResponse = await createOrder(apictx, orderDetails)
  expect(createOrderResponse).toBeOK()
  const createdOrder = await createOrderResponse.json()
  expect(createdOrder).toBeTruthy()
  expect(createdOrder.amount).toBe(orderDetails.amount)
  expect(createdOrder.currency).toBe(orderDetails.currency)
  expect(createdOrder.id).toBeTruthy()
  expect(createdOrder.status).toBe('created')
  expect(createdOrder.receipt).toBe(orderDetails.receipt)
})

test('should fail when creating an order above max USD amount', async ({ apictx }) => {
  const orderAboveMaxAmount = {
    ...orderDetails,
    amount: orderAmountLimits.aboveMaxUsd
  }

  const createOrderResponse = await createOrder(apictx, orderAboveMaxAmount)
  expect(createOrderResponse.status()).toBe(400)
  const errorBody = await createOrderResponse.json()
  expect(errorBody.error).toBeTruthy()
  expect(errorBody.error.description).toContain(orderErrors.amountExceedsMaxDescription)
})

test('should fail when creating an order without amount', async ({ apictx }) => {
  const { amount, ...orderWithoutAmount } = orderDetails
  const createOrderResponse = await createOrder(apictx, orderWithoutAmount)
  expect(createOrderResponse.status()).toBe(400)
  const errorBody = await createOrderResponse.json()
  expect(errorBody.error).toBeTruthy()
  expect(errorBody.error.description).toContain(orderErrors.amountRequiredDescription)
  expect(errorBody.error.reason).toBe(orderErrors.inputValidationFailedReason)
})

test('should fail when creating an order with amount below the minimum', async ({ apictx }) => {
  const orderBelowMinAmount = {
    ...orderDetails,
    amount: orderAmountLimits.belowMinInrAmount,
    currency: orderAmountLimits.inrCurrency
  }

  const createOrderResponse = await createOrder(apictx, orderBelowMinAmount)
  expect(createOrderResponse.status()).toBe(400)
  const errorBody = await createOrderResponse.json()
  expect(errorBody.error).toBeTruthy()
  expect(errorBody.error.description).toContain(orderErrors.amountBelowMinDescription)
  expect(errorBody.error.code).toBe(orderErrors.badRequestCode)
})
