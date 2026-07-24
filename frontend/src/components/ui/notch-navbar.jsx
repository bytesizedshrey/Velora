import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { Home, ShoppingBag, PlusCircle, LayoutDashboard, User, LogIn, Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Helper component for navigation links
const NavLink = ({ href, icon: Icon, label }) => (
  <Link
    to={href}
    className="group flex items-center gap-2 text-xs font-semibold text-white/75 hover:text-white transition-colors whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-white/5"
  >
    {Icon && <Icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />}
    <span>{label}</span>
  </Link>
)

export function NotchNavbar({ className, ...props }) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)

  const isSeller = user?.role === 'seller'

  // Navigation items configuration according to Velora marketplace
  const items = {
    left: [
      { label: "Marketplace", href: "/", icon: Home },
      ...(isSeller ? [{ label: "Studio", href: "/seller/dashboard", icon: LayoutDashboard }] : [])
    ],
    right: [
      ...(isSeller ? [{ label: "Post Product", href: "/seller/create-product", icon: PlusCircle }] : [])
    ]
  }

  return (
    <>
      <header
        className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0 text-white select-none", className)}
        {...props}
      >
        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-[#060606] z-20 relative min-w-0 border-b border-[#141414]">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.5} />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">

          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            {/* Dark Glass Background */}
            <div
              className="absolute inset-0 bg-[#060606]"
              style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.5} />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            {/* Background & Lines Layer */}
            <div className="absolute inset-0 bg-[#060606]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.5} />
              </svg>
            </div>

            {/* Content Layer */}
            <div className="relative w-full h-full flex items-end justify-center pb-2.5 px-10 md:px-16 gap-6 md:gap-10">

              {/* Desktop Left Nav */}
              <nav className="hidden md:flex gap-5 md:gap-7 mb-0.5 shrink-0 items-center">
                {items.left.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile Menu Button (Left) */}
              <button
                className="md:hidden mb-1 p-1 text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo (Center Notch) */}
              <div className="flex justify-center shrink-0 mx-2 md:mx-4 mb-0.5">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="w-7 h-7 rounded-lg bg-[#141414] border-t border-[#242424] border-l border-[#242424] border-r border-[#080808] border-b border-[#080808] shadow-md shadow-black/50 grid place-items-center text-xs font-bold text-white group-hover:scale-105 transition-transform">
                    V
                  </div>
                  <span className="font-bold text-sm tracking-tight text-white font-sans">
                    Velora
                  </span>
                </Link>
              </div>

              {/* Desktop Right Nav */}
              <nav className="hidden md:flex gap-5 md:gap-7 items-center shrink-0 mb-0.5">
                {items.right.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}

                <div className="flex gap-4 shrink-0 items-center">
                  {user ? (
                    <div className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full bg-[#121212] border-t border-[#222222] border-l border-[#222222] border-r border-[#080808] border-b border-[#080808] shadow-sm shadow-black/60 whitespace-nowrap shrink-0">
                      <div className="w-5 h-5 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-[10px] font-bold text-white/90 uppercase shrink-0">
                        {user.fullname?.[0] || 'U'}
                      </div>
                      <span className="text-xs font-semibold text-white/90 font-sans tracking-tight shrink-0">
                        {user.fullname}
                      </span>
                      <span className="text-[10px] font-medium text-white/40 uppercase tracking-normal shrink-0">
                        • {user.role}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-xs font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap"
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
              <div className="md:hidden flex items-center gap-2 mb-1">
                <Link to="/" className="text-xs text-white/70 font-semibold">
                  Velora
                </Link>
              </div>

            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            {/* Dark Glass Background */}
            <div
              className="absolute inset-0 bg-[#060606]"
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.5} />
            </svg>
          </div>

        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-[#060606] z-20 relative min-w-0 -ml-px border-b border-[#141414]">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={0.5} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={0.5} />
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
            className="fixed inset-x-0 top-16 z-40 bg-[#080808] border-b border-[#1a1a1a] p-4 md:hidden shadow-2xl"
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
                  <span className="text-xs uppercase tracking-wider text-white/50">{user.role}</span>
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
