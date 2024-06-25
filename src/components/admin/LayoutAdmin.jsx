import { useState } from 'react';
import { Button, Flex, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Sidebar from './layout/Sidebar';
import '../../assets/css/admin/index.css';
import CustomHeader from './layout/Header';
import PropTypes from 'prop-types';

const { Sider, Header, Content } = Layout;

// eslint-disable-next-line no-unused-vars
const LayoutAdmin = ({ accessToken, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} className='sider'>
        <Sidebar />
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className='triger-btn'
        />
      </Sider>
      <Layout>
        <Header className='header'>
          <CustomHeader />
        </Header>
        <Content className='content'>
          <Flex gap="large">
            {children}
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};

LayoutAdmin.propTypes = {
  accessToken: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LayoutAdmin
