import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const { Content } = Layout;

export default function MainPage() {
  const [collapsed, setCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );

  const siderWidth = collapsed ? 80 : 300; 

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /> 

      <Layout
        style={{
          marginLeft: siderWidth, 
          transition: "margin-left 0.3s ease",
        }}
      >
        <Content style={{ background: "#fff", minHeight: "100vh" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}