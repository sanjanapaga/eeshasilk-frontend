import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';

const { Content } = Layout;

const UserLayout = ({ children }) => {
    return (
        <Layout className="user-layout">
            <AnnouncementBar />
            <Navbar />
            <Content>
                {children}
            </Content>
            <Footer />
        </Layout>
    );
};

export default UserLayout;
