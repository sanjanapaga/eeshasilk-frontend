import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    TagOutlined,
    LogoutOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './ManagementSidebar.css';

const { Sider } = Layout;
const { Title } = Typography;

const ManagementSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAdmin } = useSelector((state) => state.auth);

    const [collapsed, setCollapsed] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        {
            key: 'store',
            icon: <ShoppingOutlined />,
            label: 'Storefront',
            onClick: () => navigate('/')
        },
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin')
        },
        {
            key: '/admin/orders',
            icon: <ShoppingOutlined />,
            label: 'Orders',
            onClick: () => navigate('/admin/orders')
        },
        {
            key: '/admin/inventory',
            icon: <AppstoreOutlined />,
            label: 'Inventory',
            onClick: () => navigate('/admin')
        }
    ];

    if (isAdmin) {
        menuItems.push({
            key: '/admin/offers',
            icon: <TagOutlined />,
            label: 'Offers & Coupons',
            onClick: () => navigate('/admin')
        });
    }

    const themeClass = isAdmin ? 'theme-admin' : 'theme-agent';

    // 🔑 important: keep dashboard selected for sub routes
    const selectedKey = location.pathname.startsWith('/admin')
        ? location.pathname
        : location.pathname;

    return (
        <Sider
            className={`management-sidebar ${themeClass} ${collapsed ? 'collapsed' : 'expanded'}`}
            collapsed={collapsed}
            collapsedWidth={64}
            width={260}
            trigger={null}
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
        >
            {/* Header */}
            <div className="sidebar-header">
                <MenuOutlined className="hamburger-icon" />
                {!collapsed && (
                    <>
                        <Title level={4} className="sidebar-logo">✧ EshaSilk</Title>
                        <div className="role-badge">
                            {isAdmin ? 'ADMIN PANEL' : 'AGENT PORTAL'}
                        </div>
                    </>
                )}
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                className="sidebar-menu"
            />

            {/* Footer */}
            <div className="sidebar-footer">
                <Menu
                    mode="inline"
                    selectable={false}
                    items={[
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: !collapsed ? 'Logout' : '',
                            onClick: handleLogout,
                            danger: true
                        }
                    ]}
                />
            </div>
        </Sider>
    );
};

export default ManagementSidebar;
