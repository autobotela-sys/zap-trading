import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Checkbox,
  Space,
  message,
  Table,
  Tag,
  Row,
  Col,
  Modal,
} from 'antd';
import { accountsAPI, ordersAPI } from '../services/api';

const INDEX_LOT_SIZES: Record<string, number> = {
  NIFTY: 65,
  BANKNIFTY: 35,
  SENSEX: 20,
};

export default function TradingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [form] = Form.useForm();
  const [quantity, setQuantity] = useState(65);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      message.error('Failed to fetch accounts');
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.index || changedValues.lots) {
      const index = allValues.index || 'NIFTY';
      const lots = allValues.lots || 1;
      const lotSize = INDEX_LOT_SIZES[index];
      setQuantity(lots * lotSize);
    }
  };

  const onFinish = async (values: any) => {
    if (selectedAccounts.length === 0) {
      message.error('Please select at least one account');
      return;
    }

    setLoading(true);
    try {
      const response = await ordersAPI.placeOrder({
        account_ids: selectedAccounts,
        ...values,
      });

      const result = response.data;
      if (result.success) {
        message.success(result.message);
      } else {
        message.warning(result.message);
      }

      // Show order results
      Modal.info({
        title: 'Order Results',
        width: 600,
        content: (
          <div>
            {result.orders.map((order: any, idx: number) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <Tag color={order.success ? 'green' : 'red'}>
                  {order.account}
                </Tag>
                : {order.message}
              </div>
            ))}
          </div>
        ),
      });
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={16}>
      <Col span={16}>
        <Card title="Place Order">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            initialValues={{
              index: 'NIFTY',
              lots: 1,
              option_type: 'CE',
              transaction_type: 'BUY',
              product: 'MIS',
              order_type: 'MARKET',
              amo: false,
            }}
          >
            <Form.Item label="Select Accounts" required>
              <Select
                mode="multiple"
                placeholder="Select accounts to trade"
                style={{ width: '100%' }}
                value={selectedAccounts}
                onChange={setSelectedAccounts}
                options={accounts.map((acc) => ({
                  label: `${acc.nickname} (${acc.api_key.substring(0, 8)}...)`,
                  value: acc.id,
                }))}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="index"
                  label="Index"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="NIFTY">NIFTY</Select.Option>
                    <Select.Option value="BANKNIFTY">BANKNIFTY</Select.Option>
                    <Select.Option value="SENSEX">SENSEX</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="expiry"
                  label="Expiry"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select expiry">
                    <Select.Option value="2025-01-30">2025-01-30</Select.Option>
                    <Select.Option value="2025-02-06">2025-02-06</Select.Option>
                    <Select.Option value="2025-02-27">2025-02-27</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="option_type"
                  label="Option Type"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="CE">CE (Call)</Select.Option>
                    <Select.Option value="PE">PE (Put)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="strike"
                  label="Strike Price"
                  rules={[{ required: true }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="24000" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="lots"
                  label="Lots"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Quantity (Auto-calculated)">
                  <InputNumber value={quantity} disabled style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="transaction_type"
                  label="Transaction Type"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="BUY">BUY</Select.Option>
                    <Select.Option value="SELL">SELL</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="product"
                  label="Product"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="MIS">MIS (Intraday)</Select.Option>
                    <Select.Option value="NRML">NRML (Normal)</Select.Option>
                    <Select.Option value="CNC">CNC (Delivery)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="order_type"
                  label="Order Type"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="MARKET">MARKET</Select.Option>
                    <Select.Option value="LIMIT">LIMIT</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.order_type !== curr.order_type}>
                  {({ getFieldValue }) =>
                    getFieldValue('order_type') === 'LIMIT' ? (
                      <Form.Item name="price" label="Limit Price">
                        <InputNumber style={{ width: '100%' }} placeholder="150.50" />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="amo" valuePropName="checked">
              <Checkbox>After Market Order (AMO)</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                Place Order ({selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''})
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Col span={8}>
        <Card title="Order Summary">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <div style={{ color: '#999', marginBottom: 4 }}>Selected Accounts</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>
                {selectedAccounts.length} account{selectedAccounts.length > 1 ? 's' : ''}
              </div>
            </div>

            <div>
              <div style={{ color: '#999', marginBottom: 4 }}>Total Quantity</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>
                {quantity * selectedAccounts.length}
              </div>
            </div>

            <div>
              <div style={{ color: '#999', marginBottom: 4 }}>Lot Size</div>
              <Form.Item noStyle shouldUpdate={(prev) => prev}>
                {({ getFieldValue }) => {
                  const index = getFieldValue('index') || 'NIFTY';
                  return (
                    <div style={{ fontSize: 18, fontWeight: 500 }}>
                      {INDEX_LOT_SIZES[index]}
                    </div>
                  );
                }}
              </Form.Item>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
