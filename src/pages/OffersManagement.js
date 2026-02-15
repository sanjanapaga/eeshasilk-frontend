import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addOffer, deleteOffer, fetchOffers, selectAllOffers } from '../features/offers/offersSlice';
import { fetchCategories } from '../features/categories/categoriesSlice';

const OffersManagement = () => {
    const dispatch = useDispatch();
    const offers = useSelector(selectAllOffers);
    const categories = useSelector((state) => state.categories.items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    React.useEffect(() => {
        dispatch(fetchOffers());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddOffer = (values) => {
        dispatch(addOffer(values));
        message.success('New offer created successfully!');
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDeleteOffer = (id) => {
        dispatch(deleteOffer(id));
        message.success('Offer deleted');
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <Tag color="gold" style={{ fontSize: 14, fontWeight: 'bold' }}>{text}</Tag>,
        },
        {
            title: 'Discount',
            key: 'discount',
            render: (_, record) => (
                <span>
                    {record.type === 'percentage' ? `${record.discount}% OFF` : `₹${record.discount} FLAT OFF`}
                </span>
            ),
        },
        {
            title: 'Target Category',
            dataIndex: 'target_category',
            key: 'target_category',
            render: (val) => (!val || val === 'all') ? <Tag color="blue">All Products</Tag> : <Tag color="magenta">{val.toUpperCase()}</Tag>,
        },
        {
            title: 'Min Spend',
            dataIndex: 'min_spend',
            key: 'min_spend',
            render: (val) => `₹${val}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm title="Delete this offer?" onConfirm={() => handleDeleteOffer(record.id)}>
                    <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Offers & Coupons</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Create New Offer
                </Button>
            </div>

            <Table dataSource={offers} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

            <Modal
                title="Create New Offer"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleAddOffer}>
                    <Form.Item
                        name="code"
                        label="Coupon Code"
                        rules={[{ required: true, message: 'Please enter a code (e.g. SUMMER20)' }]}
                    >
                        <Input placeholder="SUMMER20" style={{ textTransform: 'uppercase' }} />
                    </Form.Item>

                    <Form.Item name="type" label="Discount Type" initialValue="percentage">
                        <Select>
                            <Select.Option value="percentage">Percentage (%)</Select.Option>
                            <Select.Option value="fixed">Fixed Amount (₹)</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Discount Value"
                        rules={[{ required: true, message: 'Enter discount value' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>

                    <Form.Item name="target_category" label="Applicable Category" initialValue="all">
                        <Select>
                            <Select.Option value="all">All Products</Select.Option>
                            {categories.map(cat => (
                                <Select.Option key={cat.id} value={cat.slug || cat.name.toLowerCase()}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="min_spend"
                        label="Minimum Spend (₹)"
                        initialValue={0}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Create Offer
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default OffersManagement;
