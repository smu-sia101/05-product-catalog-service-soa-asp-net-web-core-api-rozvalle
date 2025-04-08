import { Form, Input, InputNumber, Select, Button, Layout, Col } from 'antd';
import '../styles/TestPage.css'; // Adjust the path as necessary
const { Content } = Layout;
const { TextArea } = Input;
const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Others'];

export default function TestPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <Layout style={{ padding: '12px' }}>
    <Content style={{ width: '30%' }}>
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        size="small"
        className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-sm custom-compact-form"
        labelCol={{ span: 6 }}  // Fixed width for labels
        wrapperCol={{ span: 18 }} // Remaining width for inputs
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Required' }]}
          style={{ marginBottom: 8 }}
        >
          <Input placeholder="Product name" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Required' }]}
          style={{ marginBottom: 8 }}
        >
          <InputNumber className="w-full" prefix="₱" min={0} placeholder="0.00" />
        </Form.Item>
        <Form.Item
          label="Desc"
          name="description"
          rules={[{ required: true, message: 'Required' }, { max: 200, message: 'Max 200' }]}
          style={{ marginBottom: 8 }}
        >
          <TextArea rows={2} maxLength={200} placeholder="Up to 200 chars" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Required' }]}
          style={{ marginBottom: 8 }}
        >
          <Select placeholder="Category">
            {categories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: 'Required' }]}
          style={{ marginBottom: 8 }}
        >
          <InputNumber className="w-full" min={0} placeholder="0" />
        </Form.Item>
        <Form.Item
          label="Image"
          name="imageUrl"
          rules={[{ type: 'url', message: 'Valid URL' }]}
          style={{ marginBottom: 8 }}
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>
        <Form.Item
          label=" " // Empty label to align with others
          colon={false} // Removes colon after empty label
          style={{ marginBottom: 0 }}
        >
          <Button type="primary" htmlType="submit" block>Submit</Button>
        </Form.Item>
      </Form>
    </Content>
  </Layout>
  );
}
