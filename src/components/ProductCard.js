import React from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartApi } from '../features/cart/cartSlice';
import { addToWishlistApi, removeFromWishlistApi, fetchWishlist } from '../features/wishlist/wishlistSlice';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, SafetyCertificateFilled } from '@ant-design/icons';
import { message } from 'antd';

import './ProductCard.css';

const { Text } = Typography;

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const discountedPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    const wishlistItems = useSelector(state => state.wishlist.items);
    const inWishlist = wishlistItems.some(item => parseInt(item.product_id) === parseInt(product.id));
    const { isAuthenticated } = useSelector(state => state.auth);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) return navigate('/login');
        dispatch(addToCartApi(product));
        message.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) return navigate('/login');

        try {
            if (inWishlist) {
                const wishlistItem = wishlistItems.find(item => parseInt(item.product_id) === parseInt(product.id));
                await dispatch(removeFromWishlistApi(wishlistItem.id)).unwrap();
                message.success('Removed from wishlist');
            } else {
                await dispatch(addToWishlistApi(product.id)).unwrap();
                message.success('Added to wishlist');
            }
        } catch (error) {
            message.error('Failed to update wishlist');
        }
    };

    return (
        <div className="boutique-product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="product-image-wrapper">
                <img
                    alt={product.name}
                    src={product.image_url || product.image || 'https://via.placeholder.com/300?text=No+Image'}
                    className="product-main-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                />

                {/* Product Actions Overlay */}
                <div className="product-card-actions">
                    <Button
                        shape="circle"
                        icon={inWishlist ? <HeartFilled style={{ color: 'var(--primary-gold)' }} /> : <HeartOutlined />}
                        className="action-btn wishlist-btn"
                        onClick={handleWishlistToggle}
                    />
                    <Button
                        shape="circle"
                        icon={<ShoppingCartOutlined />}
                        className="action-btn cart-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0}
                    />
                </div>

                {product.discount > 0 && (
                    <div className="product-badge-discount">{product.discount}% OFF</div>
                )}
                <div className="product-badge-silkmark">
                    <SafetyCertificateFilled /> SILK MARK
                </div>
            </div>

            <div className="product-info">
                <div className="product-category-label">{product.category?.toUpperCase()}</div>
                <h3 className="product-name-heading">{product.name}</h3>

                <div className="product-price-section">
                    {product.discount > 0 ? (
                        <>
                            <span className="price-old">₹{product.price.toLocaleString()}</span>
                            <span className="price-new">₹{discountedPrice.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="price-regular">₹{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
