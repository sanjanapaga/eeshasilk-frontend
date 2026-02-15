import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Form, Input, Button, Typography, message, Empty, Alert, Radio } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { addOrder } from '../features/orders/ordersSlice';
import { fetchOffers } from '../features/offers/offersSlice';
import { clearCartApi, fetchCart } from '../features/cart/cartSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';
import api from '../api';
import './Checkout.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalAmount, deliveryFee, grandTotal } = useSelector((state) => state.cart);
    const offers = useSelector((state) => state.offers.items);
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        dispatch(fetchOffers());
        dispatch(fetchCart());
        dispatch(fetchWishlist());
    }, [dispatch]);

    // Calculate Final Payable
    const payableAmount = grandTotal - appliedDiscount;

    const handleApplyCoupon = () => {
        if (!couponCode) {
            message.error('Please enter a coupon code');
            return;
        }

        const offer = offers.find(o => o.code === couponCode.toUpperCase());

        if (offer) {
            // Check for category-specific offer
            let eligibleItems = items;
            const targetCategory = offer.target_category;

            if (targetCategory && targetCategory !== 'all') {
                eligibleItems = items.filter(item =>
                    item.category && item.category.toLowerCase() === targetCategory.toLowerCase()
                );

                if (eligibleItems.length === 0) {
                    message.warning(`This coupon is applicable only on: ${targetCategory.toUpperCase()}`);
                    return;
                }
            }

            // Calculate total of eligible items
            const eligibleTotal = eligibleItems.reduce((sum, item) => {
                const price = item.discount > 0
                    ? Math.round(item.price * (1 - item.discount / 100))
                    : item.price;
                return sum + (price * item.quantity);
            }, 0);

            if (eligibleTotal < offer.min_spend) {
                message.warning(`Minimum spend of ₹${offer.min_spend} on ${targetCategory !== 'all' ? targetCategory : 'items'} required`);
                return;
            }

            let discountValue = 0;
            if (offer.type === 'percentage') {
                discountValue = Math.round((eligibleTotal * offer.discount) / 100);
            } else {
                discountValue = offer.discount; // Fixed amount
                // If fixed amount > eligible total, cap it? Usually yes.
                if (discountValue > eligibleTotal) discountValue = eligibleTotal;
            }

            // Global cap check (if strict about not exceeding total order value, though eligibleTotal logic handles most)
            if (discountValue > totalAmount) discountValue = totalAmount;

            setAppliedDiscount(discountValue);
            setAppliedCoupon(offer.code);
            message.success(`Coupon ${offer.code} applied! Key savings: ₹${discountValue}`);
        } else {
            message.error('Invalid coupon code');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
        message.info('Coupon removed');
    };

    const onFinish = async (values) => {
        setLoading(true);

        try {
            if (paymentMethod === 'razorpay') {
                // 1. Create Razorpay Order in Backend
                const rzpRes = await api.post('razorpay/order', { amount: payableAmount });
                const rzpOrder = rzpRes.data;

                const options = {
                    key: rzpOrder.key,
                    amount: rzpOrder.amount,
                    currency: "INR",
                    name: "EESHA SILKS",
                    description: "Purchase of Handloom Treasures",
                    image: "/logo192.png",
                    order_id: rzpOrder.id,
                    handler: async function (response) {
                        // 2. Verify Payment in Backend
                        try {
                            await api.post('razorpay/verify', {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            // 3. Place Actual Order
                            const orderData = {
                                customer_name: values.name,
                                customer_email: values.email,
                                customer_phone: values.phone,
                                shipping_address: `${values.address}, ${values.city}, ${values.state}, ${values.zipCode}`,
                                items: items.map(item => ({
                                    id: item.id,
                                    quantity: item.quantity,
                                    price: item.price
                                })),
                                subtotal: totalAmount,
                                delivery_fee: deliveryFee,
                                discount: appliedDiscount,
                                total_amount: payableAmount,
                                status: 'processing',
                                payment_method: 'razorpay',
                                payment_id: response.razorpay_payment_id
                            };

                            await dispatch(addOrder(orderData)).unwrap();
                            dispatch(clearCartApi());
                            message.success('Payment successful! Order placed.');
                            navigate('/my-orders');
                        } catch (err) {
                            message.error('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: values.name,
                        email: values.email,
                        contact: values.phone
                    },
                    theme: {
                        color: "#5D0E41" // Royal Maroon
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    message.error('Payment failed: ' + response.error.description);
                });
                rzp.open();
            } else {
                // COD Order - Direct placement
                const orderData = {
                    customer_name: values.name,
                    customer_email: values.email,
                    customer_phone: values.phone,
                    shipping_address: `${values.address}, ${values.city}, ${values.state}, ${values.zipCode}`,
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    subtotal: totalAmount,
                    delivery_fee: deliveryFee,
                    discount: appliedDiscount,
                    total_amount: payableAmount,
                    status: 'pending',
                    payment_method: 'cod',
                    payment_id: null
                };

                await dispatch(addOrder(orderData)).unwrap();
                dispatch(clearCartApi());
                message.success('Order placed successfully! Pay on delivery.');
                navigate('/my-orders');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <Content className="checkout-content">
                    <div className="container">
                        <Card className="checkout-empty">
                            <Empty
                                description="Your cart is empty"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Button type="primary" onClick={() => navigate('/shop')}>
                                    Go Shopping
                                </Button>
                            </Empty>
                        </Card>
                    </div>
                </Content>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-hero">
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/shop')} // Or go back to cart drawer if possible, but Shop is safe
                    style={{ position: 'absolute', top: '20px', left: '20px', color: 'white' }}
                >
                    Continue Shopping
                </Button>
                <Title level={1}>Checkout</Title>
                <Paragraph>Complete your order</Paragraph>
            </div>

            <Content className="checkout-content">
                <div className="container">
                    <div className="checkout-grid">
                        <Card className="checkout-form-card glass">
                            <Title level={3}>Delivery Information</Title>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                requiredMark={false}
                            >
                                <Form.Item
                                    name="name"
                                    label="Full Name"
                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                >
                                    <Input size="large" placeholder="John Doe" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' },
                                    ]}
                                >
                                    <Input size="large" placeholder="john@example.com" />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    rules={[
                                        { required: true, message: 'Please enter your phone number' },
                                        { pattern: /^[6-9]\d{9}$/, message: 'Please enter a valid 10-digit Indian mobile number' }
                                    ]}
                                >
                                    <Input size="large" placeholder="9876543210" prefix="+91" />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Street Address"
                                    rules={[{ required: true, message: 'Please enter your street address' }]}
                                >
                                    <Input.TextArea rows={2} placeholder="Flat No, Street Name" />
                                </Form.Item>

                                <div className="address-row" style={{ display: 'flex', gap: '16px' }}>
                                    <Form.Item
                                        name="city"
                                        label="City"
                                        style={{ flex: 1 }}
                                        rules={[{ required: true, message: 'Required' }]}
                                    >
                                        <Input size="large" placeholder="City" />
                                    </Form.Item>
                                    <Form.Item
                                        name="state"
                                        label="State"
                                        style={{ flex: 1 }}
                                        rules={[{ required: true, message: 'Required' }]}
                                    >
                                        <Input size="large" placeholder="State" />
                                    </Form.Item>
                                    <Form.Item
                                        name="zipCode"
                                        label="Pincode"
                                        style={{ flex: 1 }}
                                        rules={[
                                            { required: true, message: 'Required' },
                                            { pattern: /^\d{6}$/, message: 'Invalid Pincode' }
                                        ]}
                                    >
                                        <Input size="large" placeholder="600001" />
                                    </Form.Item>
                                </div>

                                <Form.Item label="Payment Method">
                                    <Radio.Group
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        size="large"
                                    >
                                        <Radio.Button value="razorpay" style={{ marginRight: '10px' }}>
                                            💳 Online Payment (Card/UPI/Netbanking)
                                        </Radio.Button>
                                        <Radio.Button value="cod">
                                            💵 Cash on Delivery
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={loading}
                                    className="place-order-btn"
                                >
                                    Place Order (₹{payableAmount.toLocaleString()})
                                </Button>
                            </Form>
                        </Card>

                        <div className="order-summary-container">
                            <Card className="order-summary-card glass">
                                <Title level={3}>Order Summary</Title>
                                <div className="summary-items">
                                    {items.map((item) => (
                                        <div key={item.id} className="summary-item">
                                            <div className="summary-item-info">
                                                <Text strong>{item.name}</Text>
                                                <Text type="secondary">x {item.quantity}</Text>
                                            </div>
                                            <Text strong>₹{(item.price * item.quantity).toLocaleString()}</Text>
                                        </div>
                                    ))}
                                </div>

                                <div className="coupon-section">
                                    <div className="coupon-input-group">
                                        <Input
                                            placeholder="Enter Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={!!appliedCoupon}
                                        />
                                        {appliedCoupon ? (
                                            <Button danger onClick={handleRemoveCoupon}>Remove</Button>
                                        ) : (
                                            <Button type="primary" ghost onClick={handleApplyCoupon}>Apply</Button>
                                        )}
                                    </div>
                                    {appliedCoupon && (
                                        <Alert
                                            message={`Coupon ${appliedCoupon} applied`}
                                            type="success"
                                            showIcon
                                            style={{ marginTop: 12 }}
                                        />
                                    )}
                                </div>

                                <div className="summary-totals">
                                    <div className="summary-row">
                                        <Text>Subtotal</Text>
                                        <Text>₹{totalAmount.toLocaleString()}</Text>
                                    </div>
                                    <div className="summary-row">
                                        <Text>Delivery Fee</Text>
                                        <Text type={deliveryFee === 0 ? "success" : undefined}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </Text>
                                    </div>
                                    {appliedDiscount > 0 && (
                                        <div className="summary-row discount-row">
                                            <Text type="success">Discount</Text>
                                            <Text type="success">-₹{appliedDiscount.toLocaleString()}</Text>
                                        </div>
                                    )}
                                    <div className="summary-divider"></div>
                                    <div className="summary-row total-row">
                                        <Title level={4}>Total</Title>
                                        <Title level={4} type="warning">₹{payableAmount.toLocaleString()}</Title>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    );
};
export default Checkout;
