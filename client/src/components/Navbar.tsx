"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useTheme } from "@/hooks/useTheme";

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/shop",       label: "Shop" },
  { href: "/collections",label: "Collections" },
  { href: "/about",      label: "About" },
  { href: "/contact",    label: "Contact" },
] as const;

export default function Navbar() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLoggedIn,       setIsLoggedIn]       = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartCount,        setCartCount]        = useState(0);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Init from localStorage ── */
  useEffect(() => {
    const storedUser  = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedCart  = localStorage.getItem("cart");

    if (storedUser && storedToken) setIsLoggedIn(true);

    if (storedCart) {
      try {
        const cart = JSON.parse(storedCart);
        setCartCount(
          cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)
        );
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
  }, []);

  /* ── Cross-tab storage sync ── */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "cart") {
        if (e.newValue) {
          try {
            const cart = JSON.parse(e.newValue);
            setCartCount(
              cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)
            );
          } catch (err) {
            console.error("Error parsing cart:", err);
          }
        } else {
          setCartCount(0);
        }
      }
      if ((e.key === "user" || e.key === "token") && !e.newValue) {
        setIsLoggedIn(false);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* ── Click-outside closes dropdown ── */
  useEffect(() => {
    if (!showUserDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserDropdown]);

  /* ── Helpers ── */
  const close = () => { setShowUserDropdown(false); setMobileMenuOpen(false); };

  const go = (path: string) => { router.push(path); close(); };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    close();
    router.push("/");
  };

  const dropdownHoverIn  = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.backgroundColor = "var(--surface)");
  const dropdownHoverOut = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.backgroundColor = "transparent");

  /* ── Render ── */
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "5rem",
        backgroundColor: "var(--navbar-bg)",
        borderBottom: "1px solid var(--navbar-border)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "0.5rem",
              backgroundColor: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s",
            }}
          >
            <Icon
              icon="mdi:clothing-store"
              width={20}
              height={20}
              style={{ color: "var(--background)" }}
            />
          </div>
          <span
            className="font-serif"
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--navbar-text)",
              transition: "opacity 0.2s",
            }}
          >
            Sera
          </span>
        </Link>

        {/* ── Desktop nav links — centred ── */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "0.25rem",
            flex: 1,
            justifyContent: "center",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                position: "relative",
                padding: "0.4rem 0.75rem",
                borderRadius: "0.4rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "var(--navbar-text)",
                textDecoration: "none",
                transition: "background-color 0.2s, opacity 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>

          {/* Search */}
          <button
            aria-label="Search"
            style={{
              padding: "0.5rem",
              borderRadius: "0.4rem",
              border: "none",
              background: "transparent",
              color: "var(--navbar-text)",
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
            }
          >
            <Icon icon="mdi:magnify" width={20} height={20} />
          </button>

          {/* User dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown((v) => !v)}
              aria-label="User menu"
              aria-expanded={showUserDropdown}
              style={{
                padding: "0.5rem",
                borderRadius: "0.4rem",
                border: "none",
                background: "transparent",
                color: "var(--navbar-text)",
                cursor: "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              {isLoggedIn ? (
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    icon="mdi:account"
                    width={18}
                    height={18}
                    style={{ color: "#FFF3E6" }}
                  />
                </div>
              ) : (
                <Icon icon="mdi:account-circle" width={24} height={24} />
              )}
            </button>

            {/* Dropdown panel */}
            {showUserDropdown && (
              <div
                className="animate-fadeIn"
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.5rem)",
                  right: 0,
                  minWidth: "13rem",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--divider)",
                  boxShadow: "0 8px 32px -4px rgba(0,0,0,0.18)",
                  zIndex: 110,
                }}
              >
                {isLoggedIn ? (
                  <>
                    {[
                      { icon: "mdi:account-outline", label: "Profile",  action: () => go("/user") },
                      { icon: "mdi:package-outline",  label: "Orders",   action: () => go("/user/orders") },
                      { icon: "mdi:cog-outline",       label: "Settings", action: () => go("/user/settings") },
                    ].map(({ icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.7rem 1rem",
                          border: "none",
                          background: "transparent",
                          color: "var(--foreground)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          fontSize: "0.875rem",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={dropdownHoverIn}
                        onMouseLeave={dropdownHoverOut}
                      >
                        <Icon icon={icon} width={16} height={16} />
                        {label}
                      </button>
                    ))}

                    <div style={{ height: "1px", backgroundColor: "var(--divider)", margin: "0.25rem 0" }} />

                    <button
                      onClick={toggleTheme}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.7rem 1rem",
                        border: "none",
                        background: "transparent",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        fontSize: "0.875rem",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={dropdownHoverIn}
                      onMouseLeave={dropdownHoverOut}
                    >
                      <Icon
                        icon={isDarkMode ? "mdi:white-balance-sunny" : "mdi:moon-waning-crescent"}
                        width={16}
                        height={16}
                      />
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>

                    <div style={{ height: "1px", backgroundColor: "var(--divider)", margin: "0.25rem 0" }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.7rem 1rem",
                        border: "none",
                        background: "transparent",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        fontSize: "0.875rem",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                      }
                    >
                      <Icon icon="mdi:logout" width={16} height={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {[
                      { icon: "mdi:login",       label: "Login",   action: () => go("/auth/login") },
                      { icon: "mdi:account-plus", label: "Sign Up", action: () => go("/auth/signup") },
                    ].map(({ icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.7rem 1rem",
                          border: "none",
                          background: "transparent",
                          color: "var(--foreground)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          fontSize: "0.875rem",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={dropdownHoverIn}
                        onMouseLeave={dropdownHoverOut}
                      >
                        <Icon icon={icon} width={16} height={16} />
                        {label}
                      </button>
                    ))}

                    <div style={{ height: "1px", backgroundColor: "var(--divider)", margin: "0.25rem 0" }} />

                    <button
                      onClick={toggleTheme}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.7rem 1rem",
                        border: "none",
                        background: "transparent",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        fontSize: "0.875rem",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={dropdownHoverIn}
                      onMouseLeave={dropdownHoverOut}
                    >
                      <Icon
                        icon={isDarkMode ? "mdi:white-balance-sunny" : "mdi:moon-waning-crescent"}
                        width={16}
                        height={16}
                      />
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/user/cart"
            aria-label="Cart"
            style={{ position: "relative", display: "flex" }}
          >
            <button
              style={{
                padding: "0.5rem",
                borderRadius: "0.4rem",
                border: "none",
                background: "transparent",
                color: "var(--navbar-text)",
                cursor: "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              <Icon icon="mdi:shopping-cart" width={22} height={22} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: "1.1rem",
                    height: "1.1rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-secondary)",
                    color: "#FFF3E6",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* Mobile hamburger — hidden on desktop via CSS */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="mobile-menu-btn"
            style={{
              padding: "0.5rem",
              borderRadius: "0.4rem",
              border: "none",
              background: "transparent",
              color: "var(--navbar-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
            }
          >
            <Icon
              icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"}
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile menu drawer ── */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu animate-fadeIn"
          style={{
            backgroundColor: "var(--navbar-bg)",
            borderTop: "1px solid var(--divider)",
            padding: "0.75rem 1rem 1.25rem",
          }}
        >
          {/* Nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--navbar-text)",
                  textDecoration: "none",
                  display: "block",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                }
              >
                {label}
              </Link>
            ))}
          </div>

          <div style={{ height: "1px", backgroundColor: "var(--divider)", margin: "0.75rem 0" }} />

          {/* Auth links on mobile */}
          {isLoggedIn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {[
                { icon: "mdi:account-outline", label: "Profile",  path: "/user" },
                { icon: "mdi:package-outline",  label: "Orders",   path: "/user/orders" },
                { icon: "mdi:cog-outline",       label: "Settings", path: "/user/settings" },
              ].map(({ icon, label, path }) => (
                <button
                  key={label}
                  onClick={() => go(path)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    background: "transparent",
                    color: "var(--navbar-text)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                  }
                >
                  <Icon icon={icon} width={18} height={18} />
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", padding: "0 0.25rem" }}>
              <button onClick={() => go("/auth/login")}  className="btn-outline" style={{ flex: 1, justifyContent: "center" }}>Login</button>
              <button onClick={() => go("/auth/signup")} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>Sign Up</button>
            </div>
          )}

          <div style={{ height: "1px", backgroundColor: "var(--divider)", margin: "0.75rem 0" }} />

          {/* Theme toggle */}
          <button
            onClick={() => { toggleTheme(); close(); }}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "transparent",
              color: "var(--navbar-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.95rem",
              fontWeight: 500,
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted-light)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
            }
          >
            <Icon
              icon={isDarkMode ? "mdi:white-balance-sunny" : "mdi:moon-waning-crescent"}
              width={20}
              height={20}
            />
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "transparent",
                color: "#dc2626",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                marginTop: "0.25rem",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              <Icon icon="mdi:logout" width={20} height={20} />
              Logout
            </button>
          )}
        </div>
      )}

      {/* Responsive CSS via style tag */}
      <style>{`
        /* Show desktop nav above 768px */
        @media (min-width: 768px) {
          .desktop-nav       { display: flex !important; }
          .mobile-menu-btn   { display: none !important; }
          .mobile-menu       { display: none !important; }
        }
        /* Below 768px hide desktop nav  */
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
