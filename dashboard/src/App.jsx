import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Main from "./pages/MainPage";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import ProductDetail from "./pages/ProductDetail";
import TestPage from "./pages/TestPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="test" element={<TestPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
