import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png' 
import './App.css'
import HomePage from './pages/homePage.jsx'
import { Link, Routes, Route } from 'react-router-dom'
import LoginForm from './pages/auth/loginPage.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
   <>
      {/* Simple Navbar */}
      {/* <nav style={{ padding: "10px" }}>
        <Link to="/">Home</Link>
      </nav> */}

      <Routes>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />

        {/* Existing Page */}
        <Route
          path="/app"
          element={
            <>
              <section id="center">
                <div className="hero">
                  <img src={heroImg} className="base" width="170" height="179" alt="" />
                  <img src={reactLogo} className="framework" alt="React logo" />
                  <img src={viteLogo} className="vite" alt="Vite logo" />
                </div>

                <div>
                  <h1>Get started</h1>
                  <p>
                    Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
                  </p>
                </div>

                <button
                  className="counter"
                  onClick={() => setCount((count) => count + 1)}
                >
                  Count is {count}
                </button>
              </section>
            </>
          }
        />
      </Routes>
    </>
  )
}

export default App
