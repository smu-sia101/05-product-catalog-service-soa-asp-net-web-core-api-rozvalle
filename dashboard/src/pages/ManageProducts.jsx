import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Layout, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Divider,Row, Col, Card, Spin, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "../styles/ManageProducts.css";

const { Content } = Layout;
const { Option } = Select;

function ManageProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7192/api/products");
      setProducts(response.data);
      console.log("Products fetched successfully", response.data);
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await axios.put(`https://localhost:7192/api/products/${editingProduct.id}`, values);
        message.success("Product updated successfully");
        console.log("Product updated successfully", values);
      } else {
        await axios.post("https://localhost:7192/api/products", values);
        message.success("Product added successfully");
        console.log("Product added successfully", values);
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
      console.log("Product deleted successfully", id);
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const categories = ["Electronics", "Clothing & Apparel", "Food & Beverages", "Home & Kitchen", "Beauty & Personal Care", "Books & Stationery", "Toys & Games", "Sports & Outdoors", "Health & Wellness", "Automotive & Tools", "Furniture", "Pet Supplies", "Grocery", "Jewelry & Accessories", "Music & Movies", "Baby & Kids", "Crafts & DIY", "Gardening & Outdoor", "Office Supplies", "Others"
  ];

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Content className="product-content" style={{ padding: 30, background: "#fafafa" }}>
        <h1 className="h1-product">Product Management</h1>
        <p>View, add, edit, and delete products with ease.</p>
        <Divider />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <div style={{ display:"flex", justifyContent:'column'}}>
            <Input.Search
              placeholder="Search by name"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: 300 }}
            />
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: 200, marginLeft: 10 }}
            >
              <Option value="all">All Categories</Option>
              {categories.map((category, index) => (
                <Option key={index} value={category}>{category}</Option>
              ))}
            </Select>
          </div>
          
          <Button
            type="primary"
            className="dark-btn"
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
            <Col xs={24} sm={12} md={8} lg={4} xl={4} style={{ marginBottom: 16, marginTop:5 }} key={product.id}>
              <Card
                className="product-card"
                hoverable
                style={{ width: "100%"}} 
                cover={
                  <img
                    alt={product.name}
                    src={product.imageUrl}
                    onError={(e) => e.target.src = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75?height=680&format=webp'}
                    style={{ width: "100%", objectFit: "cover", aspectRatio: "4/3" }} 
                  />
                }
                actions={[
                  <Link to={`/products/${product.id}`} key="view">
                    <InfoCircleOutlined />
                  </Link>,
                  <Popconfirm
                    key="delete"
                    title="Delete this product?"
                    onConfirm={() => handleDelete(product.id)}
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Popconfirm>,
                  <EditOutlined
                    key="edit"
                    onClick={() => {
                      setEditingProduct(product);
                      form.setFieldsValue(product);
                      setIsModalOpen(true);
                    }}
                  />
                ]}
              >
                <Card.Meta
                  title={<span className="responsive-title">{product.name}</span>}
                  description={<span className="responsive-description">₱ {product.price}</span>}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          style={{ maxWidth: 800, padding: '20px' }}
        >
          <h1 style={{ marginBottom: -10, marginTop:0, fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>
            {editingProduct ? "Edit Product" : "Add Product"}
          </h1>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px', textAlign: 'center' }}>
            {editingProduct ? 
              "Update the details of the selected product." : 
              "Fill in the details to add a new product."}
          </p>

          <Form
            layout="horizontal"
            form={form}
            onFinish={handleSubmit}
            style={{ marginBottom: 0 }}
            labelCol={{ span: 6 }}
            labelAlign="left"
            wrapperCol={{ span: 18 }}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 8 }}>
              <Input placeholder="Product Name" />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 8 }}>
              <Input placeholder="0.00" prefix='₱' type="number" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 24 }}>
              <Input.TextArea placeholder="Describe the product" maxLength={200} rows={3} showCount style={{ resize: 'none' }} />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 8 }}>
              <Select
                showSearch
                placeholder="Select a category"
                optionFilterProp="children"
                onChange={(value) => console.log(value)}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {categories.map((category, index) => <Option key={index} value={category}>{category}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 8 }}>
              <InputNumber placeholder="0" min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 16 }}>
              <Input allowClear placeholder="https:/example.com/image.png" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block className="dark-btn">
              {editingProduct ? "Update" : "Add"} Product
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default ManageProducts;