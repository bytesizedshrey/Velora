import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { Home, ShoppingBag, PlusCircle, LayoutDashboard, Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Helper component for navigation links
const NavLink = ({ href, icon: Icon, label }) => (
  <Link
    to={href}
    className="group flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white transition-all whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-white/10 bg-transparent -translate-y-2.5"
  >
    {Icon && <Icon className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 bg-transparent" />}
    <span className="bg-transparent">{label}</span>
  </Link>
)

export function NotchNavbar({ className, ...props }) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const cartState = useSelector((state) => state.cart)
  const cartCount = cartState?.items?.length || 0

  const isSeller = user?.role === 'seller'

  const NOTCH_BG = "#141416" // Kinda gray dark charcoal theme

  // Navigation items configuration according to Velora marketplace
  const items = {
    left: [
      { label: "Marketplace", href: "/", icon: Home },
      { label: cartCount > 0 ? `Cart (${cartCount})` : "Cart", href: "/cart", icon: ShoppingBag },
      ...(isSeller ? [{ label: "Studio", href: "/seller/dashboard", icon: LayoutDashboard }] : [])
    ],
    right: [
      ...(isSeller ? [{ label: "Post Product", href: "/seller/create-product", icon: PlusCircle }] : [])
    ]
  }

  return (
    <>
      <header
        className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0 text-white select-none bg-transparent", className)}
        {...props}
      >
        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 z-20 relative min-w-0 border-b border-[#26262a]" style={{ backgroundColor: NOTCH_BG }}>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.5} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={0.5} />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px bg-transparent">

          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 bg-transparent">
            {/* Charcoal Gray Background */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: NOTCH_BG, clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="#ffffff" strokeOpacity={0.1} strokeWidth={0.5} />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px bg-transparent">
            {/* Background & Lines Layer */}
            <div className="absolute inset-0" style={{ backgroundColor: NOTCH_BG }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="#ffffff" strokeOpacity={0.1} strokeWidth={0.5} />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
              </svg>
            </div>

            {/* Content Layer - Shifted Up Vertically */}
            <div className="relative w-full h-full flex items-end justify-center pb-6 px-10 md:px-16 gap-6 md:gap-10 bg-transparent">

              {/* Desktop Left Nav */}
              <nav className="hidden md:flex gap-5 md:gap-7 shrink-0 items-center bg-transparent">
                {items.left.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile Menu Button (Left) */}
              <button
                className="md:hidden p-1 text-white/70 hover:text-white transition-colors bg-transparent -translate-y-2.5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 bg-transparent" /> : <Menu className="w-5 h-5 bg-transparent" />}
              </button>

              {/* Logo (Center Notch) */}
              <div className="flex justify-center shrink-0 mx-2 md:mx-4 bg-transparent -translate-y-2.5">
                <Link to="/" aria-label="Velora Home" className="flex items-center group bg-transparent">
                  <div className="w-7 h-7 rounded-lg bg-[#222226] border-t border-[#34343a] border-l border-[#34343a] border-r border-[#101012] border-b border-[#101012] shadow-md shadow-black/50 grid place-items-center text-xs font-bold text-white group-hover:scale-105 transition-transform">
                    V
                  </div>
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
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/90 uppercase shrink-0">
                        {user.fullname?.[0] || 'U'}
                      </div>
                      <span className="text-xs font-semibold text-white/90 tracking-tight shrink-0 bg-transparent">
                        {user.fullname}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-xs font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap bg-transparent"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="px-3.5 py-1.5 text-xs font-semibold text-black bg-white rounded-lg hover:bg-white/90 transition-colors shadow-sm whitespace-nowrap"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </nav>

              {/* Mobile Action Placeholder */}
              <div className="md:hidden flex items-center gap-2 bg-transparent -translate-y-2.5" />

            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px bg-transparent">
            {/* Charcoal Gray Background */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: NOTCH_BG, clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="#ffffff" strokeOpacity={0.1} strokeWidth={0.5} />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
            </svg>
          </div>

        </div>

        {/* Right Side Bar - Flexible width */}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-[#141416] border-b border-[#26262a] p-4 md:hidden shadow-2xl"
          >
            <nav className="flex flex-col gap-2">
              {[...items.left, ...items.right].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="h-px bg-white/10 my-2" />

              {user ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-medium text-white">{user.fullname}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center p-3 rounded-lg hover:bg-white/5 transition-colors font-medium text-white/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center p-3 rounded-lg bg-white text-black font-semibold mt-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
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
