
import React, { useState } from 'react';
import { Layout } from 'antd';
import UserHeader from './layout/Header'; // Đảm bảo đường dẫn và tên file chính xác
import PropTypes from 'prop-types';
import '../../assets/css/user/index.css';

const { Content } = Layout;

const LayoutUser = ({ children }) => {
    const [currentInterface, setCurrentInterface] = useState('desktop');

    const handleInterfaceChange = (interfaceType) => {
        setCurrentInterface(interfaceType);
    };

    return (
        <Layout>
            <UserHeader onInterfaceChange={handleInterfaceChange} />
            <Content>
                {React.cloneElement(children, { currentInterface })}
            </Content>
        </Layout>
    );
};

LayoutUser.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LayoutUser;
