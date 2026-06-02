import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const socialIcons = [
  // Instagram
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  // Twitter / X
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  // Facebook
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
];

export default function SiteFooter() {
  return (
    <footer id="footer" className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-sky-900/40 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-xl font-black text-slate-950">M</div>
              <span className="text-xl font-black text-slate-100" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                MOTOR<span className="text-sky-300">MANDI</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              India's fastest growing marketplace for automotive parts, tyres, rims, cars & bikes.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-slate-800/80 hover:bg-sky-500 rounded-lg flex items-center justify-center text-slate-200 hover:text-slate-950 transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-100 font-black text-sm tracking-widest uppercase mb-4">Categories</h4>
            <Link to="/tyres" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Tyres</Link>
            <Link to="/wheels" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Wheels</Link>
            <Link to="/rims" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Rims</Link>
            <Link to="/cars" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Cars</Link>
            <Link to="/bikes" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Bikes</Link>
            <Link to="/accessories" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Accessories</Link>
            <a href="#" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Spare Parts</a>
          </div>

          <div>
            <h4 className="text-slate-100 font-black text-sm tracking-widest uppercase mb-4">Company</h4>
            <Link to="/about" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">About Us</Link>
            <Link to="/blog" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Blog</Link>
            <Link to="/privacy-policy" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-use" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">Terms of Use</Link>
          </div>

          <div>
            <h4 className="text-slate-100 font-black text-sm tracking-widest uppercase mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="tel:+918708045979" className="flex items-center gap-2 text-slate-300 hover:text-sky-300 text-sm transition-colors">
                <Phone size={14} /> +91 8708045979
              </a>
              <a href="mailto:hello@motormandi.in" className="flex items-center gap-2 text-slate-300 hover:text-sky-300 text-sm transition-colors">
                <Mail size={14} /> hello@motormandi.in
              </a>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <MapPin size={14} /> Haryan, India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs">© 2024 MotorMandi. All rights reserved.</p>
          <p className="text-slate-400 text-xs">Built with ❤️ for auto enthusiasts across India</p>
        </div>
      </div>
    </footer>
  );
}
