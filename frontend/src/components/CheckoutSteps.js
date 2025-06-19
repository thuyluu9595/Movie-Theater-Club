import React from 'react';

export default function CheckoutSteps(props) {
  const steps = [
    { key: 'step1', label: 'Sign-In' },
    { key: 'step2', label: 'Booked' },
    { key: 'step3', label: 'Payment' },
    { key: 'step4', label: 'Place Order' },
  ];

  return (
    <div className="flex justify-center space-x-4 mb-4">
      {steps.map((s) => (
        <div
          key={s.key}
          className={props[s.key] ? 'font-semibold text-blue-600' : 'text-gray-400'}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}
