import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Layout,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Divider,
  Row,
  Col,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "../styles/ManageProducts.css";

const { Content } = Layout;

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7192/api/products");
      setProducts(response.data);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };
  
  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await axios.put(`https://localhost:7192/api/products/${editingProduct.id}`, values);
        message.success("Product updated successfully");
      } else {
        await axios.post("https://localhost:7192/api/products", values);
        message.success("Product added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error(error);
      message.error("Error saving product");
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7192/api/products/${id}`);
      message.success("Product deleted");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 30, background: "#fff" }}>
        <h1 className="h1-product">Manage Products</h1>
        <p>View, add, edit, and delete products with ease.</p>
        <Divider />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input.Search
            placeholder="Search by name or category"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            Add Product
          </Button>
        </div>

        <Row gutter={[16, 16]} style={{ overflowX: "hidden", whiteSpace: "normal" }}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} style={{ marginBottom: 16, marginTop:4 }}>
            <Card
                className="product-card"
              hoverable
              style={{ width: "100%"}} 
              cover={
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  onError={(e) => e.target.src = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75?height=680&format=webp'}
                  style={{ width: "100%", objectFit: "cover", aspectRatio: "1/1" }} 
                />
              }
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    setEditingProduct(product);
                    form.setFieldsValue(product);
                    setIsModalOpen(true);
                  }}
                />,
                <Popconfirm
                  key="delete"
                  title="Delete this product?"
                  onConfirm={() => handleDelete(product.id)}
                >
                  <DeleteOutlined style={{ color: "red" }} />
                </Popconfirm>,
                <Link to={`/product/${product.id}`} key="view">
                  <InfoCircleOutlined />
                </Link>,
              ]}
            >
              <Card.Meta
                title={product.name}
                description={`₱ ${product.price}`}
              />
            </Card>
          </Col>
          ))}
        </Row>

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image URL">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingProduct ? "Update" : "Add"} Product
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default ManageProducts;
