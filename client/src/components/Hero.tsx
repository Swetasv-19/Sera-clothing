"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-90" style={{ background: 'linear-gradient(to bottom right, #F0EDE5, #FFF3E6, #F0EDE5)' }}></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0, 70, 67, 0.05)' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(56, 25, 50, 0.05)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#381932', color: '#FFF3E6' }}>
            <Icon icon="mdi:star" width="16" height="16" className="mr-2" />
            New Collection 2024
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight" style={{ color: '#004643' }}>
            Discover Your
            <span className="block" style={{ color: '#381932' }}>Perfect Style</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(0, 70, 67, 0.7)' }}>
            Elevate your wardrobe with our curated collection of premium fashion pieces. 
            Timeless elegance meets contemporary design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/shop">
              <button className="btn-primary flex items-center gap-2 group">
                Shop Now
                <Icon 
                  icon="mdi:arrow-right" 
                  width="20" 
                  height="20" 
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
            </Link>
            <Link href="/collections">
              <button className="btn-secondary flex items-center gap-2 group">
                View Collections
                <Icon 
                  icon="mdi:grid" 
                  width="20" 
                  height="20" 
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300" style={{ backgroundColor: 'rgba(0, 70, 67, 0.1)' }}>
                <Icon icon="mdi:truck-delivery" width="32" height="32" style={{ color: '#004643' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#004643' }}>Free Shipping</h3>
              <p className="text-sm" style={{ color: 'rgba(0, 70, 67, 0.6)' }}>On orders over $100</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300" style={{ backgroundColor: 'rgba(0, 70, 67, 0.1)' }}>
                <Icon icon="mdi:shield-check" width="32" height="32" style={{ color: '#004643' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#004643' }}>Quality Guarantee</h3>
              <p className="text-sm" style={{ color: 'rgba(0, 70, 67, 0.6)' }}>Premium materials only</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300" style={{ backgroundColor: 'rgba(0, 70, 67, 0.1)' }}>
                <Icon icon="mdi:refresh" width="32" height="32" style={{ color: '#004643' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#004643' }}>Easy Returns</h3>
              <p className="text-sm" style={{ color: 'rgba(0, 70, 67, 0.6)' }}>30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon icon="mdi:chevron-down" width="32" height="32" style={{ color: 'rgba(0, 70, 67, 0.4)' }} />
      </div>
    </section>
  );
}
