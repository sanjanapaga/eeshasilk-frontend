import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Typography, Card, Steps, Row, Col, Table, Divider, Button, Tag, Space, Descriptions } from 'antd';
import { ArrowLeftOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectAllOrders } from '../features/orders/ordersSlice';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const orders = useSelector(selectAllOrders);

    // Find order by ID (ensure type match)
    const order = orders.find(o => o.id === (typeof o.id === 'string' ? id : parseInt(id)));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!order) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Title level={3}>Order Not Found</Title>
                <Button type="primary" onClick={() => navigate('/my-orders')}>
                    Back to Orders
                </Button>
            </div>
        );
    }

    const getStatusStep = (status) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        const index = steps.indexOf(status);
        return index === -1 ? 0 : index;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            processing: 'blue',
            shipped: 'cyan',
            delivered: 'green',
            cancelled: 'red'
        };
        return colors[status] || 'default';
    };


    return (
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={() => navigate('/my-orders')}
                style={{ marginBottom: '16px' }}
            >
                Back to Orders
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                <Title level={2} style={{ margin: 0 }}>Order #{order.id}</Title>
                <Tag color={getStatusColor(order.status)} style={{ fontSize: '14px', padding: '6px 12px' }}>
                    {order.status.toUpperCase()}
                </Tag>
            </div>

            {order.status !== 'cancelled' && (
                <Card style={{ marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Steps
                        current={getStatusStep(order.status)}
                        items={[
                            { title: 'Placed', description: new Date(order.created_at).toLocaleDateString() },
                            { title: 'Processing' },
                            { title: 'Shipped' },
                            { title: 'Delivered' },
                        ]}
                    />
                </Card>
            )}

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Ordered Items" style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Table
                            columns={[
                                {
                                    title: 'Product',
                                    key: 'product',
                                    render: (_, record) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img
                                                src={record.product_image || 'https://via.placeholder.com/600x800?text=Product+Image'}
                                                alt={record.product_name}
                                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                            <div>
                                                <Text strong>{record.product_name || record.name}</Text>
                                                <br />
                                                <Text type="secondary">Qty: {record.quantity}</Text>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    title: 'Price',
                                    dataIndex: 'price',
                                    key: 'price',
                                    responsive: ['md'],
                                    render: (price) => `₹${parseFloat(price).toLocaleString()}`,
                                },
                                {
                                    title: 'Total',
                                    key: 'total',
                                    align: 'right',
                                    render: (_, record) => `₹${(parseFloat(record.price) * record.quantity).toLocaleString()}`,
                                },
                            ]}
                            dataSource={order.items || []}
                            rowKey={(record) => record.id}
                            pagination={false}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Order Summary" style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Descriptions column={1} layout="vertical">
                            <Descriptions.Item label="Customer Details">
                                <Text strong>{order.customer_name}</Text><br />
                                <Text>{order.customer_email}</Text><br />
                                <Text>{order.customer_phone}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Address">
                                <Text>{order.shipping_address}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Method">
                                <Tag icon={<ShoppingOutlined />}>Cash on Delivery</Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text>Subtotal</Text>
                            <Text>₹{parseFloat(order.subtotal).toLocaleString()}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text>Shipping</Text>
                            <Text>{parseFloat(order.delivery_fee) === 0 ? 'Free' : `₹${order.delivery_fee}`}</Text>
                        </div>
                        {parseFloat(order.discount) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Text type="success">Discount</Text>
                                <Text type="success">-₹{parseFloat(order.discount).toLocaleString()}</Text>
                            </div>
                        )}
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                            <Text strong>Total</Text>
                            <Text strong style={{ color: 'var(--primary-purple)' }}>₹{parseFloat(order.total_amount).toLocaleString()}</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default OrderDetail;
