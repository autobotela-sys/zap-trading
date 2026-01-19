import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const onFinish = async (values: { email: string; password: string; full_name: string }) => {
    try {
      await register(values.email, values.password, values.full_name);
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      message.error(error || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Zap Trading
          </Title>
          <Text type="secondary">Create your account</Text>
        </div>

        <Form name="register" onFinish={onFinish} size="large">
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              type="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 5, message: 'Password must be at least 5 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {error && (
            <div style={{ color: '#ff4d4f', marginBottom: 16, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Already have an account?</Text>
          <Link to="/login" style={{ marginLeft: 8 }}>
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
