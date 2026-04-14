import "./App.css";
import HomePage from "./pages/homePage.jsx";
import TyreDetailPage from "./pages/tyreDetailPage.jsx";
import TyreListPage from "./pages/tyreListPage.jsx";
import WheelListPage from "./pages/wheelListPage.jsx";
import WheelDetailPage from "./pages/wheelDetailPage.jsx";
import CarListPage from "./pages/carListPage.jsx";
import CarDetailPage from "./pages/carDetailPage.jsx";
import BikeListPage from "./pages/bikeListPage.jsx";
import BikeDetailPage from "./pages/bikeDetailPage.jsx";
import AccessoryListPage from "./pages/accessoryListPage.jsx";
import AccessoryDetailPage from "./pages/accessoryDetailPage.jsx";
import ShopListPage from "./pages/shopListPage.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginForm from "./pages/auth/loginPage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import HomeHeader from "./components/HomeHeader.jsx";

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <HomeHeader />
      <div className={isHome ? "" : "pt-16"}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/tyres" element={<TyreListPage />} />
          <Route path="/tyre/:id" element={<TyreDetailPage />} />

          <Route path="/wheels" element={<WheelListPage />} />
          <Route path="/wheel/:id" element={<WheelDetailPage />} />

          <Route path="/cars" element={<CarListPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />

          <Route path="/bikes" element={<BikeListPage />} />
          <Route path="/bike/:id" element={<BikeDetailPage />} />

          <Route path="/accessories" element={<AccessoryListPage />} />
          <Route path="/accessory/:id" element={<AccessoryDetailPage />} />

          <Route path="/shops" element={<ShopListPage />} />

          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
