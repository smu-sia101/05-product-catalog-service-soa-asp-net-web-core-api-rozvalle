import React,{ useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { Card, Button, Spin, message, Layout, Row, Tag, Divider, Col, Rate} from 'antd';
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
          <Spin size="large" />
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
      <Layout style={{ padding: '32px', backgroundColor: '#fff' }}>
        <Row gutter={24}>
          <Col span={12}>
            <div className='product-image-container' style={{ width: '100%', height:'auto' }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '8px', objectFit: 'cover', }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='product-details' style={{ maxWidth: '600px', lineHeight: '1.6' }}>
              <h1 style={{ fontSize: '24px' }}>{product.name}</h1>
              <h2>₱ {product.price}</h2>
              <p style={{ color: '#666', marginBottom: '12px' }}>{product.description}</p>

              <div style={{ marginBottom: '8px' }}>
                <Tag color="blue">{product.category}</Tag>
              </div>

              <p><strong>Product ID:</strong> {product.id}</p>
              <p><strong>Stock:</strong> {product.stock}</p>

              <Button type="primary" href="/products">
                Back to List
              </Button>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}
export default ProductDetail
