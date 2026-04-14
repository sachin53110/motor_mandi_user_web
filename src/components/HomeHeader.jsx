import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LOGO_SRC from "../assets/motorMandiLogo.png";

const navLinks = [
  { label: "Shops", to: "/shops" },
];

export default function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const existing = document.querySelector('link[data-mm-font="bebas"]');
    if (existing) return;

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    link.rel = "stylesheet";
    link.dataset.mmFont = "bebas";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50" : "bg-white/65"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_SRC} alt="MotorMandi Logo" className="h-10 w-auto object-contain" />
            <span
              className="text-xl font-black text-gray-900"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              MOTOR<span className="text-blue-500">MANDI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    active ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-900"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden pb-4 bg-gray-50 border-t border-gray-200"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 pt-3 flex gap-3">
              <Link
                to="/login"
                className="flex-1 text-center text-sm py-2 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                to="/"
                className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg"
              >
                Post Ad FREE
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
