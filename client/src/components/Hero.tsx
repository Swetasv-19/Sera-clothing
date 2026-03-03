"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        height: "calc(100dvh - 5rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-5%",
            width: "clamp(200px, 35vw, 500px)",
            height: "clamp(200px, 35vw, 500px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--muted-light) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-5%",
            width: "clamp(200px, 40vw, 600px)",
            height: "clamp(200px, 40vw, 600px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--muted-light) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="container-padded animate-slideUp"
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <h1
          className="font-serif"
          style={{
            color: "var(--foreground)",
            marginBottom: "1.25rem",
            fontWeight: 700,
          }}
        >
          Discover Your
          <span className="block" style={{ color: "var(--accent-secondary)" }}>
            Perfect Style
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--muted)",
            maxWidth: "36rem",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}
        >
          Elevate your wardrobe with our curated collection of premium fashion
          pieces. Timeless elegance meets contemporary design.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link href="/shop">
            <button className="btn-primary">
              Shop Now
              <Icon icon="mdi:arrow-right" width={18} height={18} />
            </button>
          </Link>
          <Link href="/collections">
            <button className="btn-secondary">
              View Collections
              <Icon icon="mdi:grid" width={18} height={18} />
            </button>
          </Link>
        </div>
      </div>

      {/* Scroll caret */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 1.8s infinite",
          color: "var(--foreground)",
          opacity: 0.4,
          zIndex: 10,
        }}
      >
        <Icon icon="mdi:chevron-down" width={32} height={32} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
