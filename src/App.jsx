import { Button, Flex, Layout } from 'antd';
import { useState } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Sidebar from './components/Sidebar';
import './App.css';
import CustomHeader from './components/Header';
import MainContent from './components/MainContent';
import SideContent from './components/SideContent';

const { Sider, Header, Content } = Layout;
const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed} className='sider'>
        <Sidebar />

        <Button type='text' icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} className='triger-btn' />
      </Sider>
      <Layout>
        <Header className='header'>
          <CustomHeader></CustomHeader>
        </Header>
        <Content className='content'>
          <Flex gap="large ">
            <MainContent />
            <SideContent />
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App
