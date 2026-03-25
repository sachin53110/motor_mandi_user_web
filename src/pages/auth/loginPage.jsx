import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Car,
  Zap,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import  LOGO_SRC from "../../assets/motorMandiLogo.png";

const VIEWS = { LOGIN: "login", SIGNUP: "signup", FORGOT: "forgot" };

export default function AuthScreen() {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleForgot = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex  font-sans" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d2b1a 0%, #0f3d22 50%, #145c2f 100%)" }}
      >
        {/* Decorative rings */}
        <div
          className="absolute"
          style={{
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1.5px solid rgba(34,197,94,0.12)",
            right: -140,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "1.5px solid rgba(34,197,94,0.18)",
            right: -60,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1.5px solid rgba(34,197,94,0.25)",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div
            className="w-30 h-30 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <img
                        src={LOGO_SRC}
                        alt="MotorMandi Logo"
                        className="h-30 w-auto object-contain drop-shadow-lg"
                        style={{ filter: "drop-shadow(0 0 8px rgba(245,197,24,0.4))" }}
                      />    
          </div>
          {/* <span className="text-white font-bold text-xl tracking-tight">
            MOTOR<span style={{ color: "#22c55e" }}>MANDI</span>
          </span> */}
        </div>

        {/* Center content */}
        <div className="z-10 space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}
            />
            India's #1 Auto Marketplace
          </div>

          <div>
            <h1 className="text-white font-black leading-none tracking-tight" style={{ fontSize: 52 }}>
              OLD &amp; NEW<br />
              <span style={{ color: "#22c55e" }}>TYRES,</span><br />
              <span style={{ color: "#22c55e" }}>WHEELS</span>{" "}
              <span className="text-white">&amp;</span><br />
              <span className="text-white">MORE</span>
            </h1>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 340 }}>
            The smartest way to trade automotive parts, vehicles &amp; accessories. 8,000+ verified listings. Real prices. Zero middlemen.
          </p>

          <div className="flex gap-10">
            {[
              { val: "8,000+", label: "Active Listings" },
              { val: "12K+", label: "Happy Buyers" },
              { val: "99%", label: "Verified Sellers" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="font-black text-2xl" style={{ color: "#22c55e" }}>{val}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <div className="z-10 flex gap-3">
          {[
            { icon: <ShieldCheck size={14} />, text: "Secure & Verified" },
            { icon: <Zap size={14} />, text: "Instant Listings" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              <span style={{ color: "#22c55e" }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full" style={{ maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Car size={20} color="#16a34a" />
            <span className="font-bold text-lg tracking-tight text-gray-900">
              MOTOR<span style={{ color: "#16a34a" }}>MANDI</span>
            </span>
          </div>

          {/* ── LOGIN ── */}
          {view === VIEWS.LOGIN && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h2>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Sign in to your MotorMandi account</p>
              </div>

              {/* Google */}
              <button
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-semibold text-sm transition-all hover:bg-gray-50 active:scale-95"
                style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3-11.3-7.2l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.2-4.5 5.5l6.2 5.2C40.9 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                <span className="text-xs" style={{ color: "#9ca3af" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        border: "1.5px solid #e5e7eb",
                        color: "#111827",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#16a34a")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <button
                      onClick={() => setView(VIEWS.FORGOT)}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: "#16a34a" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                      onFocus={e => (e.target.style.borderColor = "#16a34a")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#9ca3af" }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              >
                Sign In <ArrowRight size={16} />
              </button>

              <p className="text-center text-sm" style={{ color: "#6b7280" }}>
                Don't have an account?{" "}
                <button
                  onClick={() => setView(VIEWS.SIGNUP)}
                  className="font-bold hover:underline"
                  style={{ color: "#16a34a" }}
                >
                  Sign up free
                </button>
              </p>
            </div>
          )}

          {/* ── SIGNUP ── */}
          {view === VIEWS.SIGNUP && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setView(VIEWS.LOGIN)}
                  className="flex items-center gap-1.5 text-sm font-semibold mb-4 hover:underline"
                  style={{ color: "#16a34a" }}
                >
                  <ChevronLeft size={16} /> Back to login
                </button>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create account</h2>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Join 12K+ buyers &amp; sellers on MotorMandi</p>
              </div>

              <button
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-semibold text-sm transition-all hover:bg-gray-50 active:scale-95"
                style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3-11.3-7.2l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.2-4.5 5.5l6.2 5.2C40.9 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                Sign up with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                <span className="text-xs" style={{ color: "#9ca3af" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                    onFocus={e => (e.target.style.borderColor = "#16a34a")}
                    onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                      onFocus={e => (e.target.style.borderColor = "#16a34a")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                      onFocus={e => (e.target.style.borderColor = "#16a34a")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#9ca3af" }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">Confirm password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                      onFocus={e => (e.target.style.borderColor = "#16a34a")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#9ca3af" }}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              >
                Create Account <ArrowRight size={16} />
              </button>

              <p className="text-center text-xs" style={{ color: "#9ca3af" }}>
                By signing up, you agree to our{" "}
                <span className="underline cursor-pointer" style={{ color: "#16a34a" }}>Terms</span> &amp;{" "}
                <span className="underline cursor-pointer" style={{ color: "#16a34a" }}>Privacy Policy</span>
              </p>

              <p className="text-center text-sm" style={{ color: "#6b7280" }}>
                Already have an account?{" "}
                <button
                  onClick={() => setView(VIEWS.LOGIN)}
                  className="font-bold hover:underline"
                  style={{ color: "#16a34a" }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === VIEWS.FORGOT && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => { setView(VIEWS.LOGIN); setSubmitted(false); }}
                  className="flex items-center gap-1.5 text-sm font-semibold mb-4 hover:underline"
                  style={{ color: "#16a34a" }}
                >
                  <ChevronLeft size={16} /> Back to login
                </button>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reset password</h2>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                  {submitted
                    ? "Check your inbox for reset instructions."
                    : "Enter your email and we'll send you a reset link."}
                </p>
              </div>

              {!submitted ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">Email address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ border: "1.5px solid #e5e7eb", color: "#111827" }}
                        onFocus={e => (e.target.style.borderColor = "#16a34a")}
                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleForgot}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
                  >
                    Send Reset Link <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8 rounded-2xl space-y-3"
                  style={{ background: "rgba(22,163,74,0.06)", border: "1.5px solid rgba(22,163,74,0.15)" }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(22,163,74,0.1)" }}
                  >
                    <Mail size={26} color="#16a34a" />
                  </div>
                  <p className="font-bold text-gray-900">Email sent!</p>
                  <p className="text-sm text-center" style={{ color: "#6b7280", maxWidth: 260 }}>
                    We've sent a reset link to <strong>{forgotEmail || "your email"}</strong>. Check your inbox.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}