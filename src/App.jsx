import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png' 
import './App.css'
import HomePage from './pages/homePage.jsx'
import TyreDetailPage from './pages/tyreDetailPage.jsx'
import TyreListPage from './pages/tyreListPage.jsx'
import WheelListPage from './pages/wheelListPage.jsx'
import WheelDetailPage from './pages/wheelDetailPage.jsx'
import CarListPage from './pages/carListPage.jsx'
import CarDetailPage from './pages/carDetailPage.jsx'
import BikeListPage from './pages/bikeListPage.jsx'
import BikeDetailPage from './pages/bikeDetailPage.jsx'
import AccessoryListPage from './pages/accessoryListPage.jsx'
import AccessoryDetailPage from './pages/accessoryDetailPage.jsx'
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
        
        {/* Tyres Routes */}
        <Route path="/tyres" element={<TyreListPage />} />
        <Route path="/tyre/:id" element={<TyreDetailPage />} />
        
        {/* Wheels Routes */}
        <Route path="/wheels" element={<WheelListPage />} />
        <Route path="/wheel/:id" element={<WheelDetailPage />} />
        
        {/* Cars Routes */}
        <Route path="/cars" element={<CarListPage />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
        
        {/* Bikes Routes */}
        <Route path="/bikes" element={<BikeListPage />} />
        <Route path="/bike/:id" element={<BikeDetailPage />} />
        
        {/* Accessories Routes */}
        <Route path="/accessories" element={<AccessoryListPage />} />
        <Route path="/accessory/:id" element={<AccessoryDetailPage />} />
        
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
