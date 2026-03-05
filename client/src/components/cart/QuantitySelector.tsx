"use client";

import { Icon } from "@iconify/react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQty: number) => void;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  return (
    <div className="cart-qty" role="group" aria-label="Quantity selector">
      <button
        className="cart-qty__btn"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        type="button"
      >
        <Icon icon="mdi:minus" width={16} />
      </button>
      <span className="cart-qty__value" aria-live="polite">
        {quantity}
      </span>
      <button
        className="cart-qty__btn"
        onClick={() => onQuantityChange(quantity + 1)}
        aria-label="Increase quantity"
        type="button"
      >
        <Icon icon="mdi:plus" width={16} />
      </button>
    </div>
  );
}
