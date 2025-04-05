import React,{ useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { Card, Button, Spin, message } from 'antd';
import axios from 'axios';

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
    }, [id]); // Fetch product whenever the id changes
  
    if (loading) {
      return <Spin size="large" />;
    }
  
    if (!product) {
      return <p>Product not found!</p>;
    }
  
    return (
      <div style={{ padding: '20px' }}>
        <Card
          title={product.name}
          style={{ width: 600 }}
          cover={<img alt={product.name} src={product.imageUrl} />}
        >
          <p><strong>Price:</strong> ₱{product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
  
          <Button type="primary" onClick={() => window.history.back()}>Back to List</Button>
        </Card>
      </div>
    );
  }
}
export default ProductDetail
