import React from 'react';
import { Layout } from 'antd';
import UserHeader from './layout/Header'; // Điều chỉnh đường dẫn cho đúng
import PropTypes from 'prop-types';
import { useState } from 'react';

const { Content } = Layout;

const LayoutUser = ({ children }) => {
    const [currentInterface, setCurrentInterface] = useState('desktop');

    const handleInterfaceChange = (interfaceType) => {
        setCurrentInterface(interfaceType);
    };

    return (
        <Layout>
            <UserHeader onInterfaceChange={handleInterfaceChange} />
            <Content className="content">
                {React.cloneElement(children, { currentInterface })}
            </Content>
        </Layout>
    );
};

LayoutUser.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LayoutUser;
