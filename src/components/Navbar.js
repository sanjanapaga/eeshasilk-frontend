import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Badge, Drawer, Dropdown, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MenuOutlined, HeartOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { logout } from '../features/auth/authSlice';
import { selectWishlistItems, clearWishlist } from '../features/wishlist/wishlistSlice';
import { clearCart } from '../features/cart/cartSlice';
import { fetchCategories } from '../features/categories/categoriesSlice';
import CartDrawer from './CartDrawer';
import { Input } from 'antd';
import './Navbar.css';

const { Header } = Layout;

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user, isAdmin, isAgent } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);
    const wishlistItems = useSelector(selectWishlistItems);
    const categories = useSelector((state) => state.categories.items);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const lastNavigatedSearchRef = useRef('');

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearWishlist());
        dispatch(clearCart());
        navigate('/');
    };

    React.useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fallback categories if API hasn't loaded yet
    const fallbackCategories = [
        { id: 1, name: 'Saree', slug: 'saree' },
        { id: 2, name: 'Banarasi', slug: 'banarasi' },
        { id: 3, name: 'Kanchipuram', slug: 'kanchipuram' },
        { id: 4, name: 'Mysore Silk', slug: 'mysore-silk' },
        { id: 5, name: 'Lehenga', slug: 'lehenga' },
        { id: 6, name: 'Kurta', slug: 'kurta' },
        { id: 7, name: 'Bags', slug: 'bags' }
    ];

    const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

    console.log('🏷️ Categories for dropdown:', displayCategories);

    // Build menu items array
    const categoryMenuItems = displayCategories.map(cat => ({
        key: cat.slug || cat.id.toString(),
        label: cat.name.toUpperCase(),
        onClick: () => {
            console.log(`🛒 Navbar: Clicked "${cat.name}" (slug: ${cat.slug})`);
            navigate(`/shop?category=${cat.slug}`);
        }
    }));

    const shopMenu = {
        items: [
            {
                key: 'all',
                label: 'All Products',
                onClick: () => {
                    console.log('🛒 Navbar: Clicked "All Products"');
                    navigate('/shop?category=all');
                }
            },
            { type: 'divider' },
            ...categoryMenuItems
        ]
    };

    const navItems = [
        { key: '/', label: 'HOME', path: '/' },
        {
            key: '/shop',
            label: (
                <Dropdown menu={shopMenu} className="nav-dropdown-trigger">
                    <span onClick={() => navigate('/shop')}>
                        SHOP <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
                    </span>
                </Dropdown>
            ),
            path: '/shop'
        },
        { key: '/about', label: 'ABOUT US', path: '/about' },
        { key: '/contact', label: 'CONTACT', path: '/contact' },
        ...((isAdmin || isAgent) ? [{ key: '/admin', label: 'DASHBOARD', path: '/admin' }] : []),
    ];

    const [searchParams] = useSearchParams();
    const currentSearch = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = React.useState(currentSearch);

    // Sync state with URL change (e.g. when cleared from shop page or back/forward)
    useEffect(() => {
        // Only sync if the URL search is different from our local state
        // AND it's not the one we just navigated to (prevents race conditions while typing)
        if (currentSearch !== searchQuery.trim() && currentSearch !== lastNavigatedSearchRef.current) {
            setSearchQuery(currentSearch);
        }
    }, [currentSearch, searchQuery]);

    // Live filtering effect
    useEffect(() => {
        // Only trigger if searchQuery is different from what's already in the URL
        if (searchQuery.trim() === currentSearch) return;

        const delayDebounceFn = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);
            const trimmedSearch = searchQuery.trim();
            
            if (trimmedSearch) {
                newParams.set('search', trimmedSearch);
            } else {
                newParams.delete('search');
            }

            const searchStr = newParams.toString();
            lastNavigatedSearchRef.current = trimmedSearch;
            navigate(`/shop${searchStr ? '?' + searchStr : ''}`);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, currentSearch, navigate, searchParams]);

    const handleSearch = (value) => {
        const trimmed = value.trim();
        if (trimmed !== currentSearch) {
            const newParams = new URLSearchParams(searchParams);
            if (trimmed) {
                newParams.set('search', trimmed);
            } else {
                newParams.delete('search');
            }
            const searchStr = newParams.toString();
            lastNavigatedSearchRef.current = trimmed;
            navigate(`/shop${searchStr ? '?' + searchStr : ''}`);
        }
    };

    return (
        <Header className="navbar-wrapper">
            {/* Tier 2: Search | Logo | Actions */}
            <div className="navbar-main-row">
                <div className="navbar-container">
                    <div className="navbar-left">
                        <Input
                            placeholder="SEARCH HERE..."
                            prefix={<SearchOutlined style={{ color: 'var(--primary-gold)' }} />}
                            allowClear
                            onPressEnter={(e) => handleSearch(e.target.value)}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="nav-search-input"
                        />
                    </div>

                    <div className="navbar-logo-center" onClick={() => navigate('/')}>
                        <div className="logo-content">
                            <img
                                src="/logo.png"
                                alt="Eesha Silks"
                                className="brand-logo-img"
                            />
                            <h1 className="logo-text">EESHA SILKS</h1>
                            <span className="logo-subtext">HANDLOOM BOUTIQUE</span>
                            <span className="logo-premium">PREMIUM COLLECTION</span>
                        </div>
                    </div>

                    <div className="navbar-right">
                        <div className="navbar-actions">
                            {!location.pathname.startsWith('/admin') && isAuthenticated && user && (
                                <>
                                    <Badge count={wishlistItems.length} size="small" className="wishlist-badge" onClick={() => navigate('/wishlist')}>
                                        <HeartOutlined className="navbar-icon" />
                                    </Badge>
                                    <Badge count={itemCount} size="small" className="cart-badge" onClick={() => setCartOpen(true)}>
                                        <ShoppingCartOutlined className="navbar-icon" />
                                    </Badge>
                                </>
                            )}

                            {isAuthenticated ? (
                                <Dropdown
                                    menu={{
                                        items: [
                                            { key: 'orders', label: 'My Orders', icon: <ShoppingOutlined />, onClick: () => navigate('/my-orders') },
                                            { key: 'wishlist', label: 'Wishlist', icon: <HeartOutlined />, onClick: () => navigate('/wishlist') },
                                            { type: 'divider' },
                                            { key: 'logout', label: 'Logout', danger: true, icon: <UserOutlined />, onClick: handleLogout },
                                        ]
                                    }}
                                >
                                    <Avatar icon={<UserOutlined />} className="user-avatar" />
                                </Dropdown>
                            ) : (
                                <UserOutlined className="navbar-icon" onClick={() => navigate('/login')} />
                            )}

                            <Button
                                className="mobile-menu-btn"
                                icon={<MenuOutlined />}
                                onClick={() => setMobileMenuOpen(true)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier 3: Centered Navigation */}
            <div className="navbar-nav-row desktop-only">
                <div className="navbar-container">
                    <ul className="centered-nav-links">
                        <li className={location.pathname === '/' ? 'active' : ''}>
                            <Link to="/">HOME</Link>
                        </li>
                        <li className={location.pathname === '/shop' ? 'active' : ''}>
                            <Dropdown menu={shopMenu} trigger={['click']}>
                                <span style={{ cursor: 'pointer' }}>
                                    SHOP <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
                                </span>
                            </Dropdown>
                        </li>
                        <li className={location.pathname === '/about' ? 'active' : ''}>
                            <Link to="/about">ABOUT US</Link>
                        </li>
                        <li className={location.pathname === '/contact' ? 'active' : ''}>
                            <Link to="/contact">CONTACT</Link>
                        </li>
                        {(isAdmin || isAgent) && (
                            <li className={location.pathname === '/admin' ? 'active' : ''}>
                                <Link to="/admin">DASHBOARD</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/logo.png" alt="Logo" style={{ height: '30px' }} />
                        <span>ESHASILK</span>
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                className="mobile-drawer"
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ padding: '20px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <Input
                        placeholder="SEARCH PRODUCTS..."
                        prefix={<SearchOutlined style={{ color: 'var(--primary-gold)' }} />}
                        allowClear
                        onPressEnter={(e) => {
                            handleSearch(e.target.value);
                            setMobileMenuOpen(false);
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="nav-search-input"
                        style={{ width: '100%' }}
                    />
                </div>
                <Menu
                    mode="inline"
                    className="mobile-nav-menu"
                    style={{ borderRight: 'none', padding: '10px 0' }}
                    items={[
                        { key: '/', label: 'HOME', onClick: () => { navigate('/'); setMobileMenuOpen(false); } },
                        {
                            key: '/shop-parent',
                            label: 'SHOP',
                            children: [
                                { key: '/shop-all', label: 'ALL PRODUCTS', onClick: () => { navigate('/shop?category=all'); setMobileMenuOpen(false); } },
                                ...displayCategories.map(cat => ({
                                    key: `/shop/cat/${cat.slug || cat.id.toString()}`,
                                    label: cat.name.toUpperCase(),
                                    onClick: () => { navigate(`/shop?category=${cat.slug}`); setMobileMenuOpen(false); }
                                }))
                            ]
                        },
                        { key: '/about', label: 'ABOUT US', onClick: () => { navigate('/about'); setMobileMenuOpen(false); } },
                        { key: '/contact', label: 'CONTACT', onClick: () => { navigate('/contact'); setMobileMenuOpen(false); } },
                        ...((isAdmin || isAgent) ? [{ key: '/admin', label: 'DASHBOARD', onClick: () => { navigate('/admin'); setMobileMenuOpen(false); } }] : []),
                    ]}
                />
            </Drawer>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </Header>
    );
};

export default Navbar;
