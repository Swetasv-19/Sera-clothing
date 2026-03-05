"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

interface OrderSummaryProps {
  subtotal: number;
}

const SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export default function OrderSummary({ subtotal }: OrderSummaryProps) {
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-summary">
      <h3 className="cart-summary__title">Order Summary</h3>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="cart-summary__row">
          <span>Estimated Shipping</span>
          <span className={shipping === 0 ? "cart-summary__free" : ""}>
            {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        {shipping === 0 && (
          <div className="cart-summary__note">
            <Icon icon="mdi:truck-fast-outline" width={16} />
            <span>
              Complimentary shipping on orders over ₹{SHIPPING_THRESHOLD}
            </span>
          </div>
        )}

        <div className="cart-summary__row">
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <div className="cart-summary__divider" />

        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn-primary cart-summary__checkout" type="button">
        <Icon icon="mdi:lock-outline" width={18} />
        Proceed to Checkout
      </button>

      <Link href="/shop" className="cart-summary__continue">
        <Icon icon="mdi:arrow-left" width={16} />
        Continue Shopping
      </Link>
    </div>
  );
}
