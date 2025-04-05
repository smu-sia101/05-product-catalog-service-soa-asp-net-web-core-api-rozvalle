import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Divider,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price", render: (price) => `₱ ${price}` },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => <img src={url} alt="product" style={{ width: 50 }} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 30, background: "#fff" }}>
        <h1>Manage Products</h1>
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

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />

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
