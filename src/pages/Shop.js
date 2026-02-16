/* eslint-disable no-unused-vars */
import React from 'react';
import { Layout, Row, Col, Button, Typography, Empty, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory, selectFilteredProducts, selectSelectedCategory, fetchProducts } from '../features/products/productsSlice';
import { fetchCategories } from '../features/categories/categoriesSlice';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const { Content } = Layout;
const { Title } = Typography;

const Shop = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectFilteredProducts);
    const selectedCategory = useSelector(selectSelectedCategory);
    const loading = useSelector((state) => state.products.loading);
    const categories = useSelector((state) => state.categories.items);

    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category') || 'all';
    const urlSearch = searchParams.get('search') || '';

    // Sync URL category/search with Redux state and fetch products
    React.useEffect(() => {
        console.log('═══════════════════════════════════════');
        console.log('📍 Shop Page: URL Params changed');
        console.log('📍 Category:', urlCategory);
        console.log('📍 Search:', urlSearch);
        console.log('📍 Dispatching fetchProducts');

        dispatch(setSelectedCategory(urlCategory));
        dispatch(fetchProducts({ category: urlCategory, search: urlSearch }));

        console.log('═══════════════════════════════════════');
        window.scrollTo(0, 0);
    }, [dispatch, urlCategory, urlSearch]);

    React.useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Local state for sort
    const [sortOrder, setSortOrder] = React.useState('default');

    const handleClearFilter = () => {
        setSearchParams({ category: 'all' });
        dispatch(setSelectedCategory('all'));
    };

    const displayedProducts = React.useMemo(() => {
        let result = [...products];

        // Sort Logic
        if (sortOrder === 'lowToHigh') {
            result.sort((a, b) => {
                const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
                const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
                return priceA - priceB;
            });
        } else if (sortOrder === 'highToLow') {
            result.sort((a, b) => {
                const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
                const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
                return priceB - priceA;
            });
        }

        return result;
    }, [products, sortOrder]);

    return (
        <div className="shop-page">
            <div className="shop-hero">
                <Title level={1} className="shop-title">Our Collection</Title>
                <p className="shop-subtitle">Discover our exquisite range of sarees and dresses</p>
            </div>

            <Content className="shop-content">
                <div className="container">
                    <div className="shop-filters fade-in">
                        {(selectedCategory !== 'all' || urlSearch) && (
                            <div className="category-indicator text-center">
                                <Title level={4}>
                                    {urlSearch ? (
                                        <>Search Results for: <span style={{ color: 'var(--primary-gold)' }}>"{urlSearch}"</span></>
                                    ) : (
                                        <>Showing: <span style={{ color: 'var(--primary-gold)' }}>{selectedCategory.replace('-', ' ').toUpperCase()}{selectedCategory.endsWith('s') ? '' : 'S'}</span></>
                                    )}
                                    <Button type="link" onClick={handleClearFilter} style={{ fontSize: '12px' }}>Clear Filter</Button>
                                </Title>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <Empty
                            description="No products found"
                            className="empty-state"
                        />
                    ) : (
                        <Row gutter={[24, 24]} className="products-grid">
                            {displayedProducts.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Content>
        </div>
    );
};

export default Shop;
