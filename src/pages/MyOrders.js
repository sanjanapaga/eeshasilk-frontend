import React, { useEffect } from 'react';
import { Layout, Card, List, Tag, Typography, Button, Empty, Row, Col, Divider, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../features/orders/ordersSlice';
import { ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './MyOrders.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const MyOrders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector((state) => state.orders);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        dispatch(fetchOrders(user.id));
    }, [dispatch, isAuthenticated, user?.id, navigate]);

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'warning',
            'processing': 'processing',
            'shipped': 'purple',
            'delivered': 'success',
            'cancelled': 'error'
        };
        return colors[status?.toLowerCase()] || 'default';
    };

    if (loading && orders.length === 0) {
        return (
            <div className="orders-loading">
                <Spin size="large" tip="Loading your treasures..." />
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <div className="orders-hero">
                <div className="container">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/shop')}
                        style={{ color: 'white', marginBottom: '16px', paddingLeft: 0 }}
                    >
                        Return to Boutique
                    </Button>
                    <Title level={1}>My Orders</Title>
                    <Paragraph>Track your handpicked masterpieces</Paragraph>
                </div>
            </div>

            <Content className="orders-content">
                <div className="container">
                    {orders.length === 0 ? (
                        <Card className="empty-orders-card glass">
                            <Empty
                                image={<ShoppingOutlined style={{ fontSize: 64, color: 'var(--primary-gold)' }} />}
                                description="You haven't ordered any treasures yet."
                            >
                                <Button type="primary" size="large" onClick={() => navigate('/shop')}>
                                    EXPLORE COLLECTIONS
                                </Button>
                            </Empty>
                        </Card>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <Card key={order.id} className="order-card-refined mb-30" bordered={false}>
                                    <div className="order-header-row">
                                        <div className="order-meta">
                                            <div className="meta-item">
                                                <Text type="secondary">ORDER ID</Text>
                                                <Text strong>#{order.id}</Text>
                                            </div>
                                            <div className="meta-item">
                                                <Text type="secondary">DATE</Text>
                                                <Text strong>{new Date(order.created_at).toLocaleDateString()}</Text>
                                            </div>
                                            <div className="meta-item">
                                                <Text type="secondary">TOTAL</Text>
                                                <Text strong className="order-total-price">₹{parseFloat(order.total_amount).toLocaleString()}</Text>
                                            </div>
                                        </div>
                                        <Tag color={getStatusColor(order.status)} className="order-status-tag">
                                            {order.status?.toUpperCase()}
                                        </Tag>
                                    </div>
                                    <Divider style={{ margin: '16px 0' }} />
                                    <div className="order-items-minimal">
                                        {order.items?.map((item) => (
                                            <Row key={item.id} gutter={16} align="middle" className="minimal-item-row">
                                                <Col span={4}>
                                                    <img src={item.product_image || 'https://via.placeholder.com/80'} alt={item.product_name} className="mini-item-img" />
                                                </Col>
                                                <Col span={14}>
                                                    <Text strong block>{item.product_name}</Text>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <Text type="secondary">Qty: {item.quantity}</Text>
                                                        {item.size && <Tag size="small" color="purple">{item.size}</Tag>}
                                                    </div>
                                                </Col>
                                                <Col span={6} style={{ textAlign: 'right' }}>
                                                    <Text strong>₹{(item.price * item.quantity).toLocaleString()}</Text>
                                                </Col>
                                            </Row>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Content>
        </div>
    );
};

export default MyOrders;
