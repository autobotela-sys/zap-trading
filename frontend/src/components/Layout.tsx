import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardOutlined, BarChartOutlined, StockOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/trading', icon: <BarChartOutlined />, label: 'Trading' },
    { key: '/positions', icon: <StockOutlined />, label: 'Positions' },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>Zap Trading</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Multi-Account Platform</p>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '18px', margin: 0 }}>
              {menuItems.find((item) => item.key === location.pathname)?.label}
            </h1>
          </div>
        </Header>
        <Content style={{ margin: '24px', overflow: 'auto' }}>{children}</Content>
      </AntLayout>
    </AntLayout>
  );
}
