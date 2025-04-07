import React,{ useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { Card, Button, Spin, message, Layout, Row, Tag, Divider, Col, Form, Input} from 'antd';
import axios from 'axios';
import '../styles/ProductDetail.css';

function ProductDetail() {{
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://localhost:7192/api/Products/${id}`);
          setProduct(response.data);
          setLoading(false);
          console.log("Product fetched successfully", response.data);
        } catch (error) {
          message.error('Failed to fetch product');
          setLoading(false);
        }
      };
      fetchProduct();
    }, [id]);
  
    if (loading) {
      return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <Spin spinning={loading} size="large" tip="Loading..." />
        </div>
      );
    }
  
    if (!product) {
      return (
        <div style={{ padding: '20px' }}>
          <Card title="Product Not Found" style={{ width: 600 }}>
            <p>The product you are looking for does not exist.</p>
            <Button type="primary" href='/products'>Back to List</Button>
          </Card>
        </div>
      )
    }
  
    return (
      <Layout style={{ minHeight: '100vh', background: "#fafafa" }}>
        <div style={{paddingLeft:32, paddingTop: 32}}>
          <h1 style={{ margin:0}}>Product Details</h1>
          <p style={{marginBottom:0}}>View details of product, including product ID, stock, and description</p>
        </div>
        <Divider />
        <Layout style={{ paddingLeft: '32px', background: "#fafafa" }}>
          <Row gutter={24}>
            <Col span={10}>
              <div className='product-image-container' style={{ width: '100%', height:'auto' }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '4/3', borderRadius: '8px', objectFit: 'cover', }}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className='product-details' style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                <h1 style={{ fontSize: '24px' }}>{product.name}</h1>
                <h2>₱ {product.price}</h2>
                <p style={{ color: '#666', marginBottom: '12px' }}>{product.description}</p>

                <div style={{ marginBottom: '8px' }}>
                  <Tag>{product.category}</Tag>
                </div>

                <p><strong>Product ID:</strong> {product.id}</p>
                <p><strong>Stock:</strong> {product.stock}</p>

                <Button type="primary" href="/products" className="dark-btn">
                  Back to List
                </Button>
              </div>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}
export default ProductDetail
