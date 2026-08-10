import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { Home, ShoppingBag, PlusCircle, LayoutDashboard, Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Helper component for navigation links
const NavLink = ({ href, icon: Icon, label, onClick }) => (
  <Link
    to={href}
    onClick={onClick}
    className="group flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white transition-all whitespace-nowrap bg-transparent -translate-y-2.5"
  >
    {Icon && <Icon className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 bg-transparent transition-opacity" />}
    <span className="bg-transparent tracking-wider">{label}</span>
  </Link>
)

export function NotchNavbar({ className, ...props }) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const cartState = useSelector((state) => state.cart)
  const cartCount = cartState?.items?.length || 0

  const isSeller = user?.role === 'seller'
  const NOTCH_BG = "#141416"

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => document.body.classList.remove('menu-open')
  }, [isMobileMenuOpen])

  const closeMenu = () => setIsMobileMenuOpen(false)

  const items = {
    left: [
      { label: cartCount > 0 ? `Bag (${cartCount})` : "Bag", href: "/cart", icon: ShoppingBag },
      ...(isSeller ? [{ label: "Atelier", href: "/seller/dashboard", icon: LayoutDashboard }] : [])
    ],
    right: [
      ...(isSeller ? [{ label: "New Release", href: "/seller/create-product", icon: PlusCircle }] : [])
    ]
  }

  return (
    <>
      <header
        className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0 text-white select-none bg-transparent", className)}
        {...props}
      >
        {/* Left Side Bar */}
        <div className="flex-1 h-10 z-20 relative min-w-0 border-b border-[#26262a]" style={{ backgroundColor: NOTCH_BG }}>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.5} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={0.5} />
          </svg>
        </div>

        {/* Notch Container */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px bg-transparent">

          {/* Left Slice */}
          <div className="w-[50px] h-full relative shrink-0 bg-transparent">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: NOTCH_BG, clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="#ffffff" strokeOpacity={0.1} strokeWidth={0.5} />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
            </svg>
          </div>

          {/* Center Slice */}
          <div className="flex-1 h-full relative min-w-0 -ml-px bg-transparent">
            <div className="absolute inset-0" style={{ backgroundColor: NOTCH_BG }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="#ffffff" strokeOpacity={0.1} strokeWidth={0.5} />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
              </svg>
            </div>

            <div className="relative w-full h-full flex items-end justify-center pb-6 px-10 md:px-16 gap-6 md:gap-10 bg-transparent">

              {/* Desktop Left Nav */}
              <nav className="hidden md:flex gap-5 md:gap-7 shrink-0 items-center bg-transparent">
                {items.left.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile — Hamburger (Left) */}
              <button
                className="md:hidden flex items-center justify-center text-white/70 hover:text-white transition-colors bg-transparent -translate-y-2.5"
                style={{ width: 44, height: 44, borderRadius: 8, background: 'transparent' }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Logo */}
              <div className="flex justify-center shrink-0 mx-2 md:mx-4 bg-transparent -translate-y-2.5">
                <Link to="/" aria-label="Velora Home" className="flex items-center gap-2 group bg-transparent" onClick={closeMenu}>
                  <span className="font-['Cormorant_Garamond',serif] text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase group-hover:text-stone-300 transition-colors whitespace-nowrap">
                    VELORA
                  </span>
                </Link>
              </div>

              {/* Desktop Right Nav */}
              <nav className="hidden md:flex gap-5 md:gap-7 items-center shrink-0 bg-transparent">
                {items.right.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
                <div className="flex gap-4 shrink-0 items-center bg-transparent -translate-y-2.5">
                  {user ? (
                    <div className="flex items-center gap-2 px-2 py-1.5 whitespace-nowrap shrink-0 bg-transparent">
                      <div className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-200 uppercase shrink-0">
                        {user.fullname?.[0] || 'V'}
                      </div>
                      <span className="text-xs font-medium text-stone-300 tracking-tight shrink-0 bg-transparent">
                        {user.fullname}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="text-xs font-medium text-stone-400 hover:text-white transition-colors whitespace-nowrap bg-transparent tracking-wider">
                        Log in
                      </Link>
                      <Link to="/register" className="text-xs font-semibold text-stone-300 hover:text-white transition-colors whitespace-nowrap bg-transparent tracking-wider uppercase">
                        Join
                      </Link>
                    </>
                  )}
                </div>
              </nav>

              {/* Mobile — Right side icons (cart + user) */}
              <div className="md:hidden flex items-center gap-1 bg-transparent -translate-y-2.5">
                {/* Cart icon with count */}
                <Link
                  to="/cart"
                  onClick={closeMenu}
                  aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ''}`}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'transparent', borderRadius: 8 }}
                >
                  <ShoppingBag className="w-4 h-4 text-white/80" />
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: '#fff', color: '#000', fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User avatar or login */}
                {user ? (
                  <div
                    style={{ width: 32, height: 32, borderRadius: '50%', background: '#1c1c20', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#d4d4d4', textTransform: 'uppercase', flexShrink: 0, marginLeft: 4 }}
                    aria-label={user.fullname}
                  >
                    {user.fullname?.[0] || 'V'}
                  </div>
                ) : (
                  <Link to="/login" onClick={closeMenu} style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase', marginLeft: 4, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                    Login
                  </Link>
                )}
              </div>

            </div>
          </div>

          {/* Right Slice */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px bg-transparent">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: NOTCH_BG, clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="#ffffff" strokeOpacity={0.1} strokeWidth={0.5} />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
            </svg>
          </div>

        </div>

        {/* Right Side Bar */}
        <div className="flex-1 h-10 z-20 relative min-w-0 -ml-px border-b border-[#26262a]" style={{ backgroundColor: NOTCH_BG }}>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.5} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={0.5} />
          </svg>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="velora-mobile-menu md:hidden"
            role="dialog"
            aria-label="Navigation menu"
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[...items.left, ...items.right].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="velora-mobile-menu__link"
                  onClick={closeMenu}
                >
                  <item.icon style={{ width: 20, height: 20, opacity: 0.7, flexShrink: 0 }} />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="velora-mobile-menu__divider" />

              {user ? (
                <div className="velora-mobile-menu__user-card">
                  <div className="velora-mobile-menu__avatar">
                    {user.fullname?.[0] || 'V'}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', margin: 0 }}>{user.fullname}</p>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', margin: 0, marginTop: 2 }}>{user.email}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/login" className="velora-mobile-menu__auth-btn velora-mobile-menu__auth-btn--login" onClick={closeMenu}>
                    Log in
                  </Link>
                  <Link to="/register" className="velora-mobile-menu__auth-btn velora-mobile-menu__auth-btn--join" onClick={closeMenu}>
                    Create Account
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default NotchNavbar
