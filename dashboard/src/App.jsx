import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Main from "./pages/MainPage";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="manageproducts" element={<ManageProducts />} />
        </Route>
      </Routes>
    </Router>
  );
}
