import React from 'react';
import { Layout, Row, Col, Typography, Empty, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { selectWishlistItems, fetchWishlist } from '../features/wishlist/wishlistSlice';
import { selectAllProducts, fetchProducts } from '../features/products/productsSlice';
import { addToCartApi, fetchCart } from '../features/cart/cartSlice';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const { Content } = Layout;
const { Title } = Typography;

const Wishlist = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlistIds = useSelector(selectWishlistItems);
    const allProducts = useSelector(selectAllProducts);
    const { isAuthenticated } = useSelector((state) => state.auth);

    React.useEffect(() => {
        dispatch(fetchProducts());
        if (isAuthenticated) {
            dispatch(fetchWishlist());
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated]);

    const wishlistProducts = allProducts.filter(product =>
        wishlistIds.some(item => parseInt(item.product_id) === parseInt(product.id))
    );

    const handleAddAllToCart = () => {
        wishlistProducts.forEach(product => {
            dispatch(addToCartApi(product));
        });
        message.success('All items added to cart!');
        navigate('/checkout');
    };

    if (wishlistProducts.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-hero">
                    <Title level={1}>My Wishlist</Title>
                    <p>Save your favorite items</p>
                </div>
                <Content className="wishlist-content">
                    <div className="container">
                        <Empty
                            description="Your wishlist is empty"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button type="primary" onClick={() => navigate('/shop')}>
                                Start Shopping
                            </Button>
                        </Empty>
                    </div>
                </Content>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-hero">
                <Title level={1}>My Wishlist</Title>
                <p>{wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved</p>
            </div>

            <Content className="wishlist-content">
                <div className="container">
                    <div className="wishlist-actions">
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleAddAllToCart}
                        >
                            Add All to Cart
                        </Button>
                    </div>

                    <Row gutter={[24, 24]} className="products-grid">
                        {wishlistProducts.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </div>
    );
};

export default Wishlist;
