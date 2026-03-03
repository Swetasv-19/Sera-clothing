"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#004643", color: "#FFF3E6" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/care"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Product Care
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255, 243, 230, 0.7)" }}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid rgba(255, 243, 230, 0.2)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className="text-sm mb-4 md:mb-0"
              style={{ color: "rgba(255, 243, 230, 0.6)" }}
            >
              © 2024 Sera Clothing. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="transition-colors duration-200"
                style={{ color: "rgba(255, 243, 230, 0.6)" }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors duration-200"
                style={{ color: "rgba(255, 243, 230, 0.6)" }}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
