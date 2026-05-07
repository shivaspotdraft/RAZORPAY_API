// ---------------------- Customer ----------------------
export const customerDetails = {
  name: 'Shiva Gupta',
  email: 'gari.kumari@example.com',
  contact: '9123456780',
  fail_existing: '0'
}

export const invalidCustomerEmail = 'shiva.gupta'

export const updatedCustomerName = 'Ramji'
export const updatedCustomerEmailDomain = 'hanuman.com'

export const fetchCustomersData = {
  validCount: 2,
  invalidCount: -1
}

export const customerErrors = {
  badRequestCode: 'BAD_REQUEST_ERROR',
  invalidEmailDescription: 'The email must be a valid email address.',
  duplicateCustomerDescription: 'Customer already exists for the merchant',
  negativeCountDescription: 'The count must be at least 1.'
}

// ---------------------- Order ----------------------
export const orderDetails = {
  amount: 56007,
  currency: 'USD',
  receipt: `Receipt no. ${Date.now()}`
}

export const orderID = {
  id: 'order_SiiQ6gPntx77Bh'
}

export const fetchOrdersData = {
  validCount: 20,
  belowMinCount: 0,
  aboveMaxCount: 101
}

export const orderAmountLimits = {
  aboveMaxUsd: 1000001,
  belowMinInrAmount: 99,
  inrCurrency: 'INR'
}

export const updateOrderNotes = {
  notes: {
    notes_key_1: 'Shiva is the king of the world',
    notes_key_2: ' I am the best SDET IN THE WORLD'
  }
}

export const invalidOrderUpdate = {
  amount: 10000
}

export const orderErrors = {
  badRequestCode: 'BAD_REQUEST_ERROR',
  inputValidationFailedReason: 'input_validation_failed',
  extraFieldSentReason: 'extra_field_sent',
  amountExceedsMaxDescription: 'Amount exceeds maximum amount allowed',
  amountBelowMinDescription: 'Order amount less than minimum amount allowed',
  amountRequiredDescription: 'is required',
  invalidIdDescription: 'The id provided does not exist',
  countBelowMinDescription: 'The count must be at least 1.',
  countAboveMaxDescription: 'The count may not be greater than 100.',
  extraFieldDescription: 'amount is/are not required',
  countField: 'count'
}

// ---------------------- Payment ----------------------
export const paymentData = {
  id: 'pay_SiL6BrYvjDHpbU',
  amount: 5000,
  method: 'card',
  status: 'captured'
}

export const fetchPaymentsData = {
  validCount: 2,
  invalidCount: 0
}

export const updatePaymentNotes = {
  notes: {
    notes_key_1: 'Shiva is the king of the world',
    notes_key_2: ' I am the best'
  }
}

export const paymentErrors = {
  badRequestCode: 'BAD_REQUEST_ERROR',
  countBelowMinDescription: 'The count must be at least 1.',
  invalidIdDescription: 'The id provided does not exist',
  inputValidationFailedReason: 'input_validation_failed',
  noRouteMatchedMessage: 'no Route matched with those values',
  extraFieldDescription: 'amount is/are not required and should not be sent'
}
