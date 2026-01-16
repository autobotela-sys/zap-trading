import { useEffect, useState } from 'react';
import { Card, Table, Tag, message, Button, Space, Row, Col, Statistic } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { positionsAPI } from '../services/api';

interface Position {
  id: number;
  account_id: number;
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  product: string;
  pnl: number;
  avg_price: number | null;
  last_price: number | null;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await positionsAPI.getPositions();
      setPositions(response.data);
    } catch (error) {
      message.error('Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'tradingsymbol',
      key: 'tradingsymbol',
      render: (symbol: string) => <strong>{symbol}</strong>,
    },
    {
      title: 'Exchange',
      dataIndex: 'exchange',
      key: 'exchange',
      render: (exchange: string) => <Tag>{exchange}</Tag>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => (
        <span style={{ color: qty > 0 ? '#52c41a' : '#ff4d4f' }}>
          {qty > 0 ? '+' : ''}{qty}
        </span>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product: string) => <Tag color="blue">{product}</Tag>,
    },
    {
      title: 'Avg Price',
      dataIndex: 'avg_price',
      key: 'avg_price',
      render: (price: number | null) => (price ? `₹${price.toFixed(2)}` : '-'),
    },
    {
      title: 'Last Price',
      dataIndex: 'last_price',
      key: 'last_price',
      render: (price: number | null) => (price ? `₹${price.toFixed(2)}` : '-'),
    },
    {
      title: 'P&L',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: number) => (
        <span style={{ color: pnl >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          ₹{pnl.toFixed(2)}
        </span>
      ),
    },
  ];

  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalPositions = positions.length;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Positions" value={totalPositions} />
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
            <Statistic
              title="Active Positions"
              value={positions.filter((p) => Math.abs(p.quantity) > 0).length}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Open Positions"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPositions}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <Table
          dataSource={positions}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} positions`,
          }}
        />
      </Card>
    </div>
  );
}
