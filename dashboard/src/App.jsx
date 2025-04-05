import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Main from "./pages/MainPage";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="manageproducts" element={<ManageProducts />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}
