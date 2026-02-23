import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Table, Button, Space, Popconfirm, Typography, Tag, message, Modal, Form, Input, InputNumber, Select, Tabs, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ShoppingOutlined, PrinterOutlined, UploadOutlined, TagOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProducts, fetchProducts } from '../features/products/productsSlice';
import { addProduct, updateProduct, deleteProduct } from '../features/products/productsSlice';
import { selectAllOrders, fetchOrders } from '../features/orders/ordersSlice';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../features/categories/categoriesSlice';
import OffersManagement from './OffersManagement';
import { parseError } from '../utils';
import AdminLayout from '../components/AdminLayout';
import './AdminDashboard.css';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const orders = useSelector(selectAllOrders);
    const { isAdmin, isAgent } = useSelector((state) => state.auth);
    const categories = useSelector((state) => state.categories.items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [videoFileList, setVideoFileList] = useState([]);
    const [form] = Form.useForm();

    // Category Management State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm] = Form.useForm();

    React.useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchOrders());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Stats Calculation
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const activeOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
    const lowStockProducts = products.filter(p => p.stock_quantity < 5).length;

    const StatsCard = ({ title, value, icon, color }) => (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            minWidth: '200px'
        }}>
            <div style={{
                fontSize: '24px',
                color: color,
                background: `${color}15`,
                padding: '12px',
                borderRadius: '50%'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ color: '#888', fontSize: '14px' }}>{title}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{value}</div>
            </div>
        </div>
    );

    const handleAddProduct = () => {
        setEditingProduct(null);
        setFileList([]);
        setAdditionalImages([]);
        setVideoFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);

        // Convert sizes string to array for Select multiple
        const formValues = { ...product };
        if (product.sizes) {
            formValues.sizes = product.sizes.split(',').map(s => s.trim());
        }
        form.setFieldsValue(formValues);
        if (product.image_url) {
            setFileList([{
                uid: '-1',
                name: 'Main Image',
                status: 'done',
                url: product.image_url,
            }]);
        } else {
            setFileList([]);
        }

        // Handle additional images if they exist
        if (product.images) {
            setAdditionalImages(product.images.map(img => ({
                uid: img.id.toString(),
                name: `image-${img.id}`,
                status: 'done',
                url: img.url,
            })));
        } else {
            setAdditionalImages([]);
        }

        // Handle videos
        if (product.videos && product.videos.length > 0) {
            setVideoFileList(product.videos.map(vid => ({
                uid: vid.id.toString(),
                name: 'Product Video',
                status: 'done',
                url: vid.url,
            })));
        } else {
            setVideoFileList([]);
        }
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await dispatch(deleteProduct(id)).unwrap();
            message.success('Product deleted successfully');
        } catch (error) {
            message.error(parseError(error));
        }
    };

    const handleSubmit = async (values) => {
        try {
            // Validate image for new products
            if (!editingProduct && fileList.length === 0) {
                message.error('Please select a product image');
                return;
            }

            const formData = new FormData();

            // Append all form values
            Object.keys(values).forEach(key => {
                if (values[key] !== undefined && key !== 'image') {
                    if (key === 'sizes' && Array.isArray(values[key])) {
                        formData.append(key, values[key].join(','));
                    } else {
                        formData.append(key, values[key]);
                    }
                }
            });

            // Append image file if selected
            if (fileList[0]?.originFileObj) {
                formData.append('image', fileList[0].originFileObj);
            }

            // Append additional images
            additionalImages.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images[]', file.originFileObj);
                }
            });

            // Append video file
            if (videoFileList[0]?.originFileObj) {
                formData.append('video', videoFileList[0].originFileObj);
            }

            if (editingProduct) {
                // If editing, track deleted images
                const currentImageIds = additionalImages.filter(f => !f.originFileObj).map(f => f.uid);
                const originalImageIds = editingProduct.images?.map(img => img.id.toString()) || [];
                const deletedImageIds = originalImageIds.filter(id => !currentImageIds.includes(id));

                if (deletedImageIds.length > 0) {
                    formData.append('delete_image_ids', deletedImageIds.join(','));
                }

                // Handle video deletion
                if (editingProduct.videos?.length > 0 && videoFileList.length === 0) {
                    formData.append('delete_video', 'true');
                }

                await dispatch(updateProduct({ id: editingProduct.id, formData })).unwrap();
                message.success('Product updated successfully');
            } else {
                await dispatch(addProduct(formData)).unwrap();
                message.success('Product added successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setAdditionalImages([]);
            setVideoFileList([]);
        } catch (error) {
            console.error('product add/update failed', error.response?.data || error);
            message.error(parseError(error));
        }
    };

    // Category Handlers
    const handleAddCategory = () => {
        setEditingCategory(null);
        categoryForm.resetFields();
        setIsCategoryModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        categoryForm.setFieldsValue(category);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        try {
            await dispatch(deleteCategory(id)).unwrap();
            message.success('Category deleted successfully');
        } catch (error) {
            message.error(parseError(error));
        }
    };

    const handleCategorySubmit = async (values) => {
        try {
            if (editingCategory) {
                await dispatch(updateCategory({ id: editingCategory.id, data: values })).unwrap();
                message.success('Category updated successfully');
            } else {
                await dispatch(addCategory(values)).unwrap();
                message.success('Category added successfully');
                dispatch(fetchCategories()); // Refetch to get the new category with ID
            }
            setIsCategoryModalOpen(false);
            categoryForm.resetFields();
        } catch (error) {
            message.error(parseError(error));
        }
    };

    const handlePrintInventory = () => {
        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Inventory Report - EshaSilk</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
              .logo { font-size: 32px; font-weight: bold; color: #6B46C1; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8f9fa; color: #333; }
              .category { text-transform: uppercase; font-size: 12px; font-weight: bold; }
              .total { margin-top: 30px; text-align: right; font-size: 18px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">EESHA SILKS</div>
              <h2>Inventory Report</h2>
              <p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => `
                  <tr>
                    <td>#${p.id}</td>
                    <td>${p.name}</td>
                    <td><span class="category">${p.category}</span></td>
                    <td>&#8377;${p.price.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">Total Products: ${products.length}</div>
          </body>
          </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <span style={{ color: '#999', fontSize: '12px' }}>#{id}</span>
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <Tag color="purple">{text.toUpperCase()}</Tag>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price, record) => (
                <span>
                    {record.discount > 0 ? (
                        <>
                            <span style={{ textDecoration: 'line-through', marginRight: 8, color: '#999' }}>
                                ₹{price.toLocaleString()}
                            </span>
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                ₹{Math.round(price * (1 - record.discount / 100)).toLocaleString()}
                            </span>
                        </>
                    ) : (
                        `₹${price.toLocaleString()}`
                    )}
                </span>
            ),
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount) => discount ? <Tag color="red">{discount}% OFF</Tag> : '-',
        },
        {
            title: 'Images',
            key: 'all_images',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <img
                        src={record.image_url || 'https://via.placeholder.com/40'}
                        alt="main"
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '2px solid #6B46C1' }}
                    />
                    {record.images?.slice(0, 4).map(img => (
                        <img
                            key={img.id}
                            src={img.url}
                            alt="sub"
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }}
                        />
                    ))}
                    {record.images?.length > 4 && (
                        <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#666' }}>
                            +{record.images.length - 4}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Stock',
            dataIndex: 'stock_quantity',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock === 0 ? 'red' : stock < 5 ? 'orange' : 'green'}>
                    {stock === 0 ? 'Out of Stock' : `${stock} Units`}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record)}>Edit</Button>
                    {isAdmin && (
                        <Popconfirm title="Delete?" onConfirm={() => handleDeleteProduct(record.id)}>
                            <Button danger icon={<DeleteOutlined />}>Delete</Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const productTabContent = (
        <>
            <div className="dashboard-actions">
                <Button icon={<PrinterOutlined />} onClick={handlePrintInventory}>Print Report</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>Add New Product</Button>
            </div>
            <Table columns={columns} dataSource={products} rowKey="id" pagination={{ pageSize: 8 }} />
        </>
    );

    return (
        <AdminLayout>
            <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                    src="/assets/images/logo.jpg"
                    alt="Eesha Silks"
                    style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
                />
                <Title level={2} style={{ margin: 0 }}>
                    {isAdmin ? 'Admin Dashboard' : 'Agent Dashboard'}
                </Title>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>
                {isAdmin && (
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${totalRevenue.toLocaleString()}`}
                        icon={<ShoppingOutlined />}
                        color="#6B46C1" // Purple
                    />
                )}
                <StatsCard
                    title="Active Orders"
                    value={activeOrders}
                    icon={<ShoppingOutlined />}
                    color="#F59E0B" // Orange
                />
                <StatsCard
                    title="Total Products"
                    value={products.length}
                    icon={<ShoppingOutlined />}
                    color="#10B981" // Green
                />
                {isAgent && (
                    <StatsCard
                        title="Low Stock Alerts"
                        value={lowStockProducts}
                        icon={<TagOutlined />}
                        color="#EF4444" // Red
                    />
                )}
            </div>

            <div className="container" style={{ marginTop: 24 }}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: 'Product Management',
                            children: productTabContent,
                        },
                        isAdmin && {
                            key: '2',
                            label: 'Offers & Coupons',
                            children: <OffersManagement />,
                        },
                        isAdmin && {
                            key: '3',
                            label: 'Category Management',
                            children: (
                                <>
                                    <div className="dashboard-actions">
                                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
                                            Add New Category
                                        </Button>
                                    </div>
                                    <Table
                                        columns={[
                                            {
                                                title: 'Name',
                                                dataIndex: 'name',
                                                key: 'name',
                                            },
                                            {
                                                title: 'Slug',
                                                dataIndex: 'slug',
                                                key: 'slug',
                                                render: (slug) => <Tag color="purple">{slug}</Tag>,
                                            },
                                            {
                                                title: 'Actions',
                                                key: 'action',
                                                render: (_, record) => (
                                                    <Space size="middle">
                                                        <Button icon={<EditOutlined />} onClick={() => handleEditCategory(record)}>Edit</Button>
                                                        <Popconfirm title="Delete?" onConfirm={() => handleDeleteCategory(record.id)}>
                                                            <Button danger icon={<DeleteOutlined />}>Delete</Button>
                                                        </Popconfirm>
                                                    </Space>
                                                ),
                                            },
                                        ]}
                                        dataSource={categories}
                                        rowKey="id"
                                        pagination={{ pageSize: 10 }}
                                    />
                                </>
                            ),
                        },
                    ].filter(Boolean)}
                />
            </div>

            <Modal
                title={editingProduct ? "Edit Product" : "Add New Product"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select>
                            {categories.map(cat => (
                                <Select.Option key={cat.slug} value={cat.slug}>{cat.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}>
                        {({ getFieldValue }) =>
                            ['kurta', 'lehenga'].includes(getFieldValue('category')) ? (
                                <Form.Item
                                    name="sizes"
                                    label="Available Sizes"
                                    help="Select all sizes available for this Kurta"
                                >
                                    <Select mode="multiple" placeholder="Select sizes">
                                        <Select.Option value="S">Small (S)</Select.Option>
                                        <Select.Option value="M">Medium (M)</Select.Option>
                                        <Select.Option value="L">Large (L)</Select.Option>
                                        <Select.Option value="XL">Extra Large (XL)</Select.Option>
                                        <Select.Option value="XXL">2X Large (XXL)</Select.Option>
                                        <Select.Option value="XXXL">3X Large (XXXL)</Select.Option>
                                    </Select>
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="stock_quantity"
                        label="Stock Quantity"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                        initialValue={10}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="discount"
                        label="Discount (%)"
                        initialValue={0}
                    >
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Main Product Image" required={!editingProduct}>
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Select Main Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Additional Images (Up to 10)"
                        help="Note: If your photos are large, try uploading only 3-5 at a time to stay within server limits (8MB total)."
                    >
                        <Upload
                            listType="picture"
                            multiple
                            maxCount={10}
                            fileList={additionalImages}
                            onChange={({ fileList }) => setAdditionalImages(fileList)}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Select More Images</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Product Video (MP4, max 50MB)">
                        <Upload
                            listType="picture"
                            maxCount={1}
                            fileList={videoFileList}
                            onChange={({ fileList }) => setVideoFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Select Video File</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block style={{ marginTop: 16 }}>
                        {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                </Form>
            </Modal>

            <Modal
                title={editingCategory ? "Edit Category" : "Add New Category"}
                open={isCategoryModalOpen}
                onCancel={() => setIsCategoryModalOpen(false)}
                footer={null}
            >
                <Form layout="vertical" form={categoryForm} onFinish={handleCategorySubmit}>
                    <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
                        <Input placeholder="e.g., Sarees, Dresses" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {editingCategory ? 'Update Category' : 'Add Category'}
                    </Button>
                </Form>
            </Modal>
        </AdminLayout>
    );
};

export default AdminDashboard;
