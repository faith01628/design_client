import { Layout } from 'antd';
import UserHeader from './layout/Header';
import PropTypes from 'prop-types';

const { Content } = Layout;

const LayoutUser = ({ children }) => {
    return (
        <Layout>
            <UserHeader />
            <Content className="content">
                {children}
            </Content>
        </Layout>
    );
};

LayoutUser.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LayoutUser;
