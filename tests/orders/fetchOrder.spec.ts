import { test, expect } from '../../fixtures/context'
import { createOrder } from '../../helper/createorder'
import { fetchOrdersData, orderDetails, orderErrors } from '../../test-data/testData'
import { orderSchema } from '../../schemas/ordersSchema'
test('should fetch all orders with a valid count', async ({ apictx }) => {
  const fetchOrdersResponse = await apictx.get('/v1/orders', {
    params: {
      count: fetchOrdersData.validCount
    }
  })
  expect(fetchOrdersResponse).toBeOK()
  const ordersList = await fetchOrdersResponse.json()
  expect(typeof ordersList.count).toBe('number')
  expect(ordersList.items).toBeTruthy()
})

test('should return 400 when fetching orders with count below the minimum', async ({ apictx }) => {
  const fetchOrdersResponse = await apictx.get('/v1/orders', {
    params: {
      count: fetchOrdersData.belowMinCount
    }
  })
  expect(fetchOrdersResponse.status()).toBe(400)
  const errorBody = await fetchOrdersResponse.json()
  expect(errorBody.error.code).toBe(orderErrors.badRequestCode)
  expect(errorBody.error.description).toContain(orderErrors.countBelowMinDescription)
  expect(errorBody.error.field).toBe(orderErrors.countField)
})

test('should return 400 when fetching orders with count above the maximum', async ({ apictx }) => {
  const fetchOrdersResponse = await apictx.get('/v1/orders', {
    params: {
      count: fetchOrdersData.aboveMaxCount
    }
  })
  expect(fetchOrdersResponse.status()).toBe(400)
  const errorBody = await fetchOrdersResponse.json()
  expect(errorBody.error.code).toContain(orderErrors.badRequestCode)
  expect(errorBody.error.description).toContain(orderErrors.countAboveMaxDescription)
  expect(errorBody.error.field).toContain(orderErrors.countField)
})

test('should fetch an order by ID', async ({ apictx }) => {
  const createOrderResponse = await createOrder(apictx, orderDetails)
  const createdOrder = await createOrderResponse.json()
  const result= orderSchema.safeParse(createdOrder)
  expect(result.success).toBe(true)
  const orderId = createdOrder.id

  const fetchOrderResponse = await apictx.get(`/v1/orders/${orderId}`)
  expect(fetchOrderResponse).toBeOK()
  const fetchedOrder = await fetchOrderResponse.json()
  expect(fetchedOrder.id).toBe(orderId)
})

test('should return 400 when fetching an order with an invalid ID', async ({ apictx }) => {
  const invalidOrderId = `order${Date.now()}`
  const fetchOrderResponse = await apictx.get(`/v1/orders/${invalidOrderId}`)
  expect(fetchOrderResponse.status()).toBe(400)
  const errorBody = await fetchOrderResponse.json()
  expect(errorBody.error.code).toBe(orderErrors.badRequestCode)
  expect(errorBody.error.description).toBe(orderErrors.invalidIdDescription)
})
