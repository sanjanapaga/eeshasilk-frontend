/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Table, Tag, Button, Space, Typography, Select, message, Popconfirm } from 'antd';
import { parseError } from '../utils';
import { PrinterOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllOrders, updateOrderStatus, deleteOrder, fetchOrders } from '../features/orders/ordersSlice';
import { useReactToPrint } from 'react-to-print';
import AdminLayout from '../components/AdminLayout';
import './OrderManagement.css';

const { Content } = Layout;
const { Title } = Typography;

const OrderManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(selectAllOrders);
    const { isAdmin } = useSelector((state) => state.auth);
    const printRef = useRef();

    React.useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
            message.success('Order status updated');
        } catch (error) {
            message.error(error || 'Failed to update status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await dispatch(deleteOrder(orderId)).unwrap();
            message.success('Order deleted');
        } catch (error) {
            message.error(error || 'Failed to delete order');
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            processing: 'blue',
            shipped: 'cyan',
            delivered: 'green',
            cancelled: 'red',
        };
        return colors[status] || 'default';
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id) => `#${String(id).padStart(4, '0')}`,
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customerName',
        },
        {
            title: 'Email',
            dataIndex: 'customer_email',
            key: 'customerEmail',
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: (items) => items ? items.length : 0,
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total',
            render: (total) => `₹${parseFloat(total).toLocaleString()}`,
        },
        {
            title: 'Order Date',
            dataIndex: 'created_at',
            key: 'orderDate',
            render: (date) => new Date(date).toLocaleDateString('en-IN'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Processing', value: 'processing' },
                { text: 'Shipped', value: 'shipped' },
                { text: 'Delivered', value: 'delivered' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    style={{ width: 130 }}
                    size="small"
                >
                    <Select.Option value="pending">
                        <Tag color="orange">Pending</Tag>
                    </Select.Option>
                    <Select.Option value="processing">
                        <Tag color="blue">Processing</Tag>
                    </Select.Option>
                    <Select.Option value="shipped">
                        <Tag color="cyan">Shipped</Tag>
                    </Select.Option>
                    <Select.Option value="delivered">
                        <Tag color="green">Delivered</Tag>
                    </Select.Option>
                    <Select.Option value="cancelled">
                        <Tag color="red">Cancelled</Tag>
                    </Select.Option>
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => navigate(`/order/${record.id}`, { state: { fromAdmin: true } })}
                    >
                        View
                    </Button>
                    <Button
                        icon={<PrinterOutlined />}
                        size="small"
                        onClick={() => printSingleOrder(record)}
                    >
                        Print
                    </Button>
                    {isAdmin && (
                        <Popconfirm
                            title="Delete Order"
                            description="Are you sure you want to delete this order?"
                            onConfirm={() => handleDeleteOrder(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const printSingleOrder = (order) => {
        const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order #${String(order.id).padStart(4, '0')}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
          .logo { font-size: 32px; font-weight: bold; color: #6B46C1; }
          .order-info { margin: 20px 0; }
          .order-info div { margin: 8px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #6B46C1; color: white; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">✧ EshaSilk</div>
          <h2>Order Invoice</h2>
        </div>
        <div class="order-info">
          <div><strong>Order ID:</strong> #${String(order.id).padStart(4, '0')}</div>
          <div><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</div>
          <div><strong>Customer Name:</strong> ${order.customer_name}</div>
          <div><strong>Email:</strong> ${order.customer_email}</div>
          <div><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</div>
          <div><strong>Status:</strong> ${order.status.toUpperCase()}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.product_name || item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${parseFloat(item.price).toLocaleString()}</td>
                <td>₹${(parseFloat(item.price) * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">Total: ₹${parseFloat(order.total_amount).toLocaleString()}</div>
      </body>
      </html>
    `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <AdminLayout>
            <div className="order-header">
                <Title level={1}>Order Management</Title>
                <p className="order-subtitle">Manage customer orders and print invoices</p>
            </div>

            <div className="order-content">
                <div className="container">
                    <div className="order-actions">
                        <Button
                            type="primary"
                            icon={<PrinterOutlined />}
                            size="large"
                            onClick={handlePrint}
                            className="print-all-btn"
                        >
                            Print All Orders
                        </Button>
                    </div>

                    <div className="orders-table-container">
                        <Table
                            columns={columns}
                            dataSource={orders}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1000 }}
                        />
                    </div>

                    {/* Hidden print template for all orders */}
                    <div style={{ display: 'none' }}>
                        <div ref={printRef} className="print-content">
                            <div className="print-header">
                                <h1>✧ EshaSilk</h1>
                                <h2>All Orders Report</h2>
                                <p>Generated on: {new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                            <table className="print-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{String(order.id).padStart(4, '0')}</td>
                                            <td>{order.customer_name}</td>
                                            <td>{order.items ? order.items.length : 0}</td>
                                            <td>₹{parseFloat(order.total_amount).toLocaleString()}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                                            <td>{order.status.toUpperCase()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderManagement;
