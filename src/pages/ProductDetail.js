import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Button, Typography, Tag, Rate, Form, Input, Card, Avatar, message, Divider, Empty } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, UserOutlined, ArrowLeftOutlined, SafetyCertificateFilled, PlayCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProducts, fetchProducts, fetchProductById } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import { addToCartApi, fetchCart } from '../features/cart/cartSlice';
import { addToWishlistApi, removeFromWishlistApi, fetchWishlist } from '../features/wishlist/wishlistSlice';
import { fetchReviews, addReview } from '../features/reviews/reviewsSlice';
import './ProductDetail.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [userRating, setUserRating] = useState(0);
    const [mainImage, setMainImage] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);

    const { list: products, loading } = useSelector((state) => state.products);
    const product = products.find(p => parseInt(p.id) === parseInt(id));
    const wishlistItems = useSelector(state => state.wishlist.items);
    const inWishlist = wishlistItems.some(item => parseInt(item.product_id) === parseInt(id));
    const reviews = useSelector((state) => state.reviews.items);
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    React.useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id, products.length]);

    React.useEffect(() => {
        if (product) {
            setMainImage(product.image_url || product.image);
            setCurrentVideo(null); // Reset when product changes
        }
    }, [product]);

    React.useEffect(() => {
        if (id) {
            dispatch(fetchReviews(id));
        }
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, id, isAuthenticated]);

    if (loading && !product) {
        return (
            <div className="product-detail-loading" style={{ padding: '100px 0', textAlign: 'center' }}>
                <Title level={3}>Discovering your masterpiece...</Title>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail">
                <Content className="container">
                    <Title level={2}>Product not found</Title>
                    <Button type="primary" onClick={() => navigate('/shop')}>
                        Back to Shop
                    </Button>
                </Content>
            </div>
        );
    }

    const handleAddToCart = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await dispatch(addToCartApi(product)).unwrap();
            message.success(`${product.name} added to cart!`);
        } catch (error) {
            message.error('Failed to add to cart');
        }
    };

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            if (inWishlist) {
                const wishlistItem = wishlistItems.find(item => parseInt(item.product_id) === parseInt(product.id));
                await dispatch(removeFromWishlistApi(wishlistItem.id)).unwrap();
                message.info('Removed from wishlist');
            } else {
                await dispatch(addToWishlistApi(product.id)).unwrap();
                message.success('Added to wishlist!');
            }
        } catch (error) {
            message.error('Failed to update wishlist');
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) return navigate('/login');
        try {
            await dispatch(addToCartApi(product)).unwrap();
            navigate('/checkout');
        } catch (error) {
            message.error('Failed to initiate checkout');
        }
    };

    const handleSubmitReview = async (values) => {
        if (!isAuthenticated) {
            message.warning('Please login to submit a review');
            navigate('/login');
            return;
        }

        try {
            await dispatch(addReview({
                productId: product.id,
                rating: userRating,
                userName: user.name || user.email.split('@')[0],
                comment: values.comment,
                userId: user.id
            })).unwrap();

            message.success('Review submitted successfully!');
            form.resetFields();
            setUserRating(0);
        } catch (error) {
            message.error(error || 'Failed to submit review');
        }
    };

    const getCategoryColor = (category) => {
        const colors = { saree: 'purple', dress: 'gold', bag: 'cyan' };
        return colors[category] || 'default';
    };

    return (
        <div className="product-detail">
            <Content className="product-detail-content">
                <div className="container">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ marginBottom: '16px', paddingLeft: 0, fontSize: '16px', color: '#333' }}
                    >
                        Back
                    </Button>
                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={12}>
                            <div className="product-image-container">
                                <div className="product-image-large">
                                    {currentVideo ? (
                                        <video
                                            src={currentVideo}
                                            controls
                                            autoPlay
                                            className="main-gallery-video"
                                            style={{ width: '100%', borderRadius: 12 }}
                                        />
                                    ) : (
                                        <img
                                            src={mainImage}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/600x800?text=Product+Image';
                                            }}
                                        />
                                    )}
                                </div>
                                {((product.images && product.images.length > 0) || (product.videos && product.videos.length > 0)) && (
                                    <div className="product-thumbnails">
                                        <div
                                            className={`thumbnail-item ${(!currentVideo && mainImage === (product.image_url || product.image)) ? 'active' : ''}`}
                                            onClick={() => {
                                                setMainImage(product.image_url || product.image);
                                                setCurrentVideo(null);
                                            }}
                                        >
                                            <img src={product.image_url || product.image} alt="main" />
                                        </div>
                                        {product.images?.map((img, idx) => (
                                            <div
                                                key={img.id}
                                                className={`thumbnail-item ${(!currentVideo && mainImage === img.url) ? 'active' : ''}`}
                                                onClick={() => {
                                                    setMainImage(img.url);
                                                    setCurrentVideo(null);
                                                }}
                                            >
                                                <img src={img.url} alt={`thumb-${idx}`} />
                                            </div>
                                        ))}
                                        {product.videos?.map((vid, idx) => (
                                            <div
                                                key={`vid-${vid.id}`}
                                                className={`thumbnail-item video-thumbnail ${currentVideo === vid.url ? 'active' : ''}`}
                                                onClick={() => {
                                                    setCurrentVideo(vid.url);
                                                    setMainImage(null);
                                                }}
                                            >
                                                <div className="video-thumb-overlay">
                                                    <PlayCircleOutlined />
                                                </div>
                                                <video src={vid.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="product-details">
                                <Tag color={getCategoryColor(product.category)} className="category-tag">
                                    {product.category.toUpperCase()}
                                </Tag>
                                <Title level={1} className="product-title">{product.name}</Title>

                                {parseFloat(avgRating) > 0 && (
                                    <div className="product-rating-section">
                                        <Rate disabled value={parseFloat(avgRating)} allowHalf />
                                        <Text className="rating-score">{avgRating} stars</Text>
                                        <Text className="review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</Text>
                                    </div>
                                )}

                                <div className="product-price-section">
                                    <div className="price-row">
                                        <div className="price-container">
                                            {product.discount > 0 ? (
                                                <>
                                                    <Text className="price original-price" delete style={{ color: '#999', fontSize: '18px', marginRight: '8px' }}>
                                                        ₹{product.price.toLocaleString()}
                                                    </Text>
                                                    <Text className="price discounted-price" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                                        ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                                                    </Text>
                                                    <Tag color="red" className="discount-tag" style={{ marginLeft: '12px' }}>
                                                        {product.discount}% OFF
                                                    </Tag>
                                                </>
                                            ) : (
                                                <Text className="price">₹{product.price.toLocaleString()}</Text>
                                            )}
                                        </div>

                                        {/* Stock Status */}
                                        <div className="stock-status">
                                            {product.stock_quantity === 0 ? (
                                                <Tag color="default" className="stock-tag">OUT OF STOCK</Tag>
                                            ) : product.stock_quantity < 5 ? (
                                                <Tag color="warning" className="stock-tag">LOW STOCK: Only {product.stock_quantity} Left</Tag>
                                            ) : (
                                                <Tag color="success" className="stock-tag">IN STOCK</Tag>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Paragraph className="product-description-full">
                                    {product.description}
                                </Paragraph>

                                <div className="silk-mark-assurance card-gold-border mb-30">
                                    <SafetyCertificateFilled className="silk-icon" />
                                    <div className="silk-text">
                                        <Text strong>SILK MARK CERTIFIED</Text>
                                        <Paragraph className="mb-0">Your assurance of 100% pure natural silk. Authenticity verified by Central Silk Board.</Paragraph>
                                    </div>
                                </div>

                                <div className="product-actions">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        disabled={product.stock_quantity === 0}
                                        className="add-to-cart-main boutique-btn-gold"
                                    >
                                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleBuyNow}
                                        disabled={product.stock_quantity === 0}
                                        className="buy-now-main boutique-btn-maroon"
                                    >
                                        Buy Now
                                    </Button>
                                    <Button
                                        size="large"
                                        icon={inWishlist ? <HeartFilled /> : <HeartOutlined />}
                                        onClick={handleWishlistToggle}
                                        className={`wishlist-main-btn boutique-btn-outline ${inWishlist ? 'active' : ''}`}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Related Products */}
                    <div className="related-products-section">
                        <Divider />
                        <Title level={2} className="section-title">Related Products</Title>
                        <Row gutter={[24, 24]}>
                            {products
                                .filter(p => p.category === product.category && p.id !== product.id)
                                .slice(0, 4)
                                .map(relatedProduct => (
                                    <Col xs={24} sm={12} md={6} key={relatedProduct.id}>
                                        <ProductCard product={relatedProduct} />
                                    </Col>
                                ))}
                        </Row>
                        {products.filter(p => p.category === product.category && p.id !== product.id).length === 0 && (
                            <Paragraph type="secondary">No related products found.</Paragraph>
                        )}
                    </div>

                    <Divider />

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <Title level={2}>Customer Reviews</Title>

                        {/* Add Review Form */}
                        <Card className="add-review-card" title="Write a Review">
                            <Form form={form} layout="vertical" onFinish={handleSubmitReview}>
                                <Form.Item label="Your Rating">
                                    <Rate value={userRating} onChange={setUserRating} />
                                </Form.Item>
                                <Form.Item
                                    name="comment"
                                    label="Your Review"
                                    rules={[{ required: true, message: 'Please write your review' }]}
                                >
                                    <TextArea rows={4} placeholder="Share your experience with this product..." />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" disabled={userRating === 0}>
                                        Submit Review
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>

                        {/* Reviews List */}
                        <div className="reviews-list">
                            {reviews.length === 0 ? (
                                <Card>
                                    <Title level={4}>No reviews yet</Title>
                                    <Paragraph>Be the first to review this product!</Paragraph>
                                </Card>
                            ) : (
                                reviews.map((review) => (
                                    <Card key={review.id} className="review-card">
                                        <div className="review-header">
                                            <div className="review-user">
                                                <Avatar icon={<UserOutlined />} />
                                                <div className="review-user-info">
                                                    <Text strong>{review.userName}</Text>
                                                    <Text type="secondary" className="review-date">{review.date}</Text>
                                                </div>
                                            </div>
                                            <Rate disabled value={review.rating} />
                                        </div>
                                        <Paragraph className="review-comment">{review.comment}</Paragraph>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    );
};

export default ProductDetail;
