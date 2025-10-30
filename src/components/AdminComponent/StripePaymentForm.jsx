import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';

const StripePaymentForm = forwardRef(({ onPaymentSuccess, onPaymentError }, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#111518',
        fontFamily: '"Manrope", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  // Expose handlePayment to parent component
  useImperativeHandle(ref, () => ({
    async handlePayment(clientSecret) {
      if (!stripe || !elements) {
        return { success: false, error: 'Stripe not loaded' };
      }

      try {
        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          onPaymentError(error.message);
          return { success: false, error: error.message };
        }

        if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
          return { success: true, paymentIntent };
        }

        return { success: false, error: 'Payment not completed' };
      } catch (err) {
        onPaymentError(err.message);
        return { success: false, error: err.message };
      }
    }
  }));

  return (
    <div>
      <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center gap-2 text-[#111518] dark:text-white">
        <Lock className="w-4 h-4 text-green-500" />
        Card Details
      </h3>

      <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
        <p className="text-xs flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Your payment is secured by Stripe. We never store your card details.
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3 text-gray-500 dark:text-gray-400 text-xs">
        <p>We accept:</p>
        <span>💳 Visa, Mastercard, Amex</span>
      </div>
    </div>
  );
});

export default StripePaymentForm;
