import React from 'react';
import { Layout } from 'antd';
import ManagementSidebar from './ManagementSidebar';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
    return (
        <Layout className="admin-layout" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <ManagementSidebar />
            <Layout className="dashboard-layout">
                <Content style={{
                    margin: '24px',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '8px',
                    minHeight: '280px'
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
