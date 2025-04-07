import { Layout, Card, Row, Typography, Divider, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCartOutlined,
  BugOutlined 
} from "@ant-design/icons";
import React from "react";
import "../styles/Dashboard.css";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const features = [
    { 
      title: "Products", 
      description: "View, update, and delete products records and details.", 
      icon: <ShoppingCartOutlined />, 
      path: "/products",
      gradient: "linear-gradient(45deg, #1677ff,rgb(85, 156, 255))"
    },
    { 
      title: "Testing", 
      description: "Test page for experimental features.", 
      icon: <BugOutlined />, 
      path: "/test",
      gradient: "linear-gradient(45deg, #1677ff,rgb(85, 156, 255))"
    }
  ];

  return (
    <Layout style={{ backgroundColor: "#fafafa", height: "100vh" }}>
      <Layout style={{ padding: 30, backgroundColor: "#fafafa"}}>
      <h1 className="dashboard-header">Dashboard</h1>
      <p >Easily manage your products with a dedicated table for quick updates, creating, editing, and deleting</p>
      <Divider className="dashboard-divider" style={{marginTop:10}} />
      <Row justify="left" style={{ gap: "10px" }}>
        {features.map((feature, index) => (
            <Card
              hoverable
              className="feature-card"
              style={{
                textAlign: "left",
                borderRadius: "10px",
                border: "none",
                background: feature.gradient,
                color: "white",
                width: "250px",
                height: "200px",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s",
              }}
              onClick={() => navigate(feature.path)}
            >
              {React.cloneElement(feature.icon, { 
                style: { fontSize: "55px", color: "white", marginBottom: "15px" } 
              })}
              <Title level={4} style={{ margin: 0, color: "white", fontWeight: "600" }}>
                {feature.title}
              </Title>
              <Text style={{ color: "white", opacity: 0.9}}>{feature.description}</Text>
            </Card>
        ))}
      </Row>
      </Layout>
    </Layout>
  );
}