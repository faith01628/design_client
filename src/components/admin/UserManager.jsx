import { useState, useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import PropTypes from 'prop-types';
import LayoutAdmin from './LayoutAdmin';

const UserManager = ({ accessToken }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!accessToken) {
                    console.error('Access token is not available.');
                    return;
                }

                const response = await fetch('http://192.168.10.156:3000/users', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users. Please try again later.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [accessToken]);

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'bod',
            key: 'bod',
        },
    ];

    return (
        <LayoutAdmin accessToken={accessToken}>
            <div style={{ padding: '20px' }}>
                <h2>User Manager</h2>
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message={error} type="error" showIcon />
                ) : (
                    <Table dataSource={users} columns={columns} />
                )}
            </div>
        </LayoutAdmin>
    );
};

UserManager.propTypes = {
    accessToken: PropTypes.string.isRequired,
};

export default UserManager;
