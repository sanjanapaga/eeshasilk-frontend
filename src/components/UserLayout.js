import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const { Content } = Layout;

const UserLayout = ({ children }) => {
    return (
        <Layout className="user-layout">
            <AnnouncementBar />
            <Navbar />
            <Content>
                {children}
            </Content>
            <ScrollToTop />
            <Footer />
        </Layout>
    );
};

export default UserLayout;
