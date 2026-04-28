import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LOGO_SRC from "../assets/motorMandiLogo.png";

const SCROLL_OFFSET_PX = 76;

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  return true;
}

export default function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const scrollTarget = location.state?.scrollTo;
    if (!scrollTarget) return;
    if (location.pathname !== "/") return;

    const attemptScroll = () => {
      const ok = scrollToId(scrollTarget);
      if (ok) {
        // Clear the history state so it won't scroll again on back/forward.
        window.history.replaceState({}, "", window.location.href);
        return;
      }
      // If the section isn't mounted yet, try once more soon.
      window.setTimeout(() => {
        const ok2 = scrollToId(scrollTarget);
        if (ok2) window.history.replaceState({}, "", window.location.href);
      }, 60);
    };

    // Wait a tick for Home page DOM to be ready.
    window.setTimeout(attemptScroll, 0);
  }, [location.pathname, location.state]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/");
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToId("categories");
      return;
    }
    navigate("/", { state: { scrollTo: "categories" } });
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const ok = scrollToId("footer");
    if (ok) return;
    navigate("/", { state: { scrollTo: "footer" } });
  };

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
            <a
              href="/"
              onClick={handleHomeClick}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                location.pathname === "/" ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </a>

            <a
              href="#categories"
              onClick={handleCategoryClick}
              className="text-sm font-semibold tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
            >
              Category
            </a>

            <Link
              to="/shops"
              className={`text-sm font-semibold tracking-wide transition-colors ${
                location.pathname.startsWith("/shops") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Shops
            </Link>

            <a
              href="#footer"
              onClick={handleContactClick}
              className="text-sm font-semibold tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
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
            <a
              href="/"
              onClick={handleHomeClick}
              className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Home
            </a>
            <a
              href="#categories"
              onClick={handleCategoryClick}
              className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Category
            </a>
            <Link
              to="/shops"
              className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Shops
            </Link>
            <a
              href="#footer"
              onClick={handleContactClick}
              className="block px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Contact
            </a>

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
