import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Tag,
  Statistic,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, DeleteOutlined, LoginOutlined } from '@ant-design/icons';
import { accountsAPI } from '../services/api';

interface Account {
  id: number;
  nickname: string;
  api_key: string;
  is_active: boolean;
  last_login: string | null;
  total_pnl: number;
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      message.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (values: any) => {
    try {
      await accountsAPI.createAccount(values);
      message.success('Account added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchAccounts();
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Failed to add account');
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await accountsAPI.deleteAccount(id);
      message.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      message.error('Failed to delete account');
    }
  };

  const handleRequestToken = async (id: number) => {
    try {
      const response = await accountsAPI.requestToken(id);
      const loginUrl = response.data.login_url;
      window.open(loginUrl, '_blank');
      message.info('Login URL opened. Please authorize and copy the request token.');
    } catch (error) {
      message.error('Failed to request token');
    }
  };

  const columns = [
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'API Key',
      dataIndex: 'api_key',
      key: 'api_key',
      render: (key: string) => key.substring(0, 10) + '...',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'P&L',
      dataIndex: 'total_pnl',
      key: 'total_pnl',
      render: (pnl: number) => (
        <span style={{ color: pnl >= 0 ? '#52c41a' : '#ff4d4f' }}>
          ₹{pnl.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (date: string | null) => (date ? new Date(date).toLocaleString() : 'Never'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Account) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<LoginOutlined />}
            onClick={() => handleRequestToken(record.id)}
          >
            Login
          </Button>
          <Popconfirm
            title="Are you sure to delete this account?"
            onConfirm={() => handleDeleteAccount(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalPnl = accounts.reduce((sum, acc) => sum + acc.total_pnl, 0);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Accounts" value={accounts.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total P&L"
              value={totalPnl}
              precision={2}
              prefix="₹"
              valueStyle={{ color: totalPnl >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Active Accounts" value={accounts.filter((a) => a.is_active).length} />
          </Card>
        </Col>
      </Row>

      <Card
        title="Your Zerodha Accounts"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Account
          </Button>
        }
      >
        <Table
          dataSource={accounts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title="Add Zerodha Account"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAccount}>
          <Form.Item
            name="nickname"
            label="Nickname"
            rules={[{ required: true, message: 'Please enter a nickname' }]}
          >
            <Input placeholder="My Main Account" />
          </Form.Item>

          <Form.Item
            name="api_key"
            label="API Key"
            rules={[{ required: true, message: 'Please enter your API key' }]}
          >
            <Input placeholder="Your Kite API key" />
          </Form.Item>

          <Form.Item
            name="api_secret"
            label="API Secret"
            rules={[{ required: true, message: 'Please enter your API secret' }]}
          >
            <Input.Password placeholder="Your Kite API secret" />
          </Form.Item>

          <Form.Item name="zerodha_user_id" label="Zerodha User ID (Optional)">
            <Input placeholder="Your Zerodha user ID" />
          </Form.Item>

          <Form.Item name="zerodha_password" label="Zerodha Password (Optional)">
            <Input.Password placeholder="Your Zerodha password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
