"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Shop: [
      { label: "All Products", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "New Arrivals", href: "/shop?sort=new" },
      { label: "Sale", href: "/shop?sale=1" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
    Support: [
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Product Care", href: "/care" },
      { label: "FAQ", href: "/faq" },
    ],
  };

  const socials = [
    { icon: "mdi:instagram", href: "#", label: "Instagram" },
    { icon: "mdi:twitter", href: "#", label: "Twitter" },
    { icon: "mdi:facebook", href: "#", label: "Facebook" },
    { icon: "mdi:pinterest", href: "#", label: "Pinterest" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--accent-primary)",
        color: "#F0EDE5",
        marginTop: "auto",
      }}
    >
      <div
        className="container-padded"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "rgba(255,243,230,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  icon="mdi:clothing-store"
                  width={20}
                  height={20}
                  style={{ color: "#FFF3E6" }}
                />
              </div>
              <span
                className="font-serif"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#FFF3E6",
                }}
              >
                Sera
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255,243,230,0.65)",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
              }}
            >
              Timeless elegance meets contemporary design. Premium fashion for
              the modern wardrobe.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "0.4rem",
                    backgroundColor: "rgba(255,243,230,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,243,230,0.8)",
                    transition: "background-color 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255,243,230,0.2)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255,243,230,0.1)")
                  }
                >
                  <Icon icon={icon} width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#FFF3E6",
                  marginBottom: "1.25rem",
                }}
              >
                {section}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,243,230,0.65)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#FFF3E6")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "rgba(255,243,230,0.65)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,243,230,0.15)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "rgba(255,243,230,0.5)" }}>
            © {year} Sera Clothing. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,243,230,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#FFF3E6")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "rgba(255,243,230,0.5)")
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
