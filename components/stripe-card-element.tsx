"use client"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { CardElementOptions } from "@stripe/stripe-js"

const CARD_ELEMENT_OPTIONS: CardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
}

export function StripeCardElement() {
  return (
    <div className="border border-gray-300 rounded-md p-3 bg-white">
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </div>
  )
}

