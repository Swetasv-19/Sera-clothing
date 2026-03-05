"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function EmptyCart() {
  return (
    <div className="cart-empty">
      <div className="cart-empty__icon-wrap">
        <Icon icon="mdi:shopping-outline" width={56} />
      </div>
      <h2 className="cart-empty__title">Your Cart is Empty</h2>
      <p className="cart-empty__desc">
        Your cart is currently empty. Browse our collections and add items you
        love to see them here.
      </p>
      <Link href="/shop" className="btn-primary cart-empty__btn">
        <Icon icon="mdi:storefront-outline" width={20} />
        Browse Collections
      </Link>
    </div>
  );
}
