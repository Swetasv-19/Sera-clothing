"use client";

import { Icon } from "@iconify/react";

export default function ContactPage() {
  return (
    <div className="container-padded py-10">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl card p-6 sm:p-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-[var(--foreground)]">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-10 leading-relaxed">
            Have a question about your order, sizing, or our collections? Reach out
            and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--muted-light)] flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:email-outline" className="text-[var(--accent-primary)] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Email Us</h3>
                  <p className="text-[var(--muted)]">support@seraclothing.com</p>
                  <p className="text-[var(--muted)]">sales@seraclothing.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--muted-light)] flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:phone-outline" className="text-[var(--accent-primary)] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Call Us</h3>
                  <p className="text-[var(--muted)]">+1 (555) 000-0000</p>
                  <p className="text-[var(--muted)]">Mon - Fri: 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--muted-light)] flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:map-marker-outline" className="text-[var(--accent-primary)] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Visit Us</h3>
                  <p className="text-[var(--muted)]">123 Fashion Street</p>
                  <p className="text-[var(--muted)]">Milan, Italy</p>
                </div>
              </div>
            </div>

            {/* Simple Contact Form Shell */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-lg focus:outline-[var(--accent-primary)]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-lg focus:outline-[var(--accent-primary)]"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--surface-alt)] border border-[var(--divider)] rounded-lg focus:outline-[var(--accent-primary)]"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
