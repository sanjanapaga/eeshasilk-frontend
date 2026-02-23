import React from 'react';
import { Drawer, List, Avatar, Button, Typography, Empty, InputNumber } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCartApi, updateQuantityApi } from '../features/cart/cartSlice';
import './CartDrawer.css';

const { Text, Title } = Typography;

const CartDrawer = ({ open, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, totalAmount, itemCount } = useSelector((state) => state.cart);

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingCartOutlined />
                    <span>Shopping Cart ({itemCount})</span>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={400}
            className="cart-drawer"
            footer={
                items.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-total">
                            <Text strong>Total:</Text>
                            <Title level={4} style={{ margin: 0, color: 'var(--primary-purple)' }}>
                                ₹{totalAmount.toLocaleString()}
                            </Title>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleCheckout}
                            className="checkout-btn"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                )
            }
        >
            {items.length === 0 ? (
                <Empty
                    description="Your cart is empty"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={onClose}>
                        Continue Shopping
                    </Button>
                </Empty>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={items}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => dispatch(removeFromCartApi(item.id))}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={item.image_url}
                                        shape="square"
                                        size={64}
                                        icon={<ShoppingCartOutlined />}
                                    />
                                }
                                title={<Text strong>{item.name}</Text>}
                                description={
                                    <div className="cart-item-details">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text type="secondary">₹{item.price.toLocaleString()}</Text>
                                            {item.size && (
                                                <Text type="secondary" style={{ fontSize: '12px', marginTop: '2px' }}>
                                                    Size: <Text strong size="small" style={{ color: 'var(--primary-gold)' }}>{item.size}</Text>
                                                </Text>
                                            )}
                                        </div>
                                        <div className="quantity-control">
                                            <InputNumber
                                                min={1}
                                                max={10}
                                                size="small"
                                                value={item.quantity}
                                                onChange={(val) => dispatch(updateQuantityApi({ id: item.id, quantity: val, cartId: item.id }))}
                                            />
                                        </div>
                                    </div>
                                }
                            />
                            <div className="item-subtotal">
                                <Text strong>₹{(item.price * item.quantity).toLocaleString()}</Text>
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </Drawer>
    );
};

export default CartDrawer;
