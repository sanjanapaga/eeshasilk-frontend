import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Badge, Drawer, Dropdown, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MenuOutlined, HeartOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { logout } from '../features/auth/authSlice';
import { selectWishlistItems } from '../features/wishlist/wishlistSlice';
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

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    React.useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fallback categories if API hasn't loaded yet
    const fallbackCategories = [
        { id: 1, name: 'Saree', slug: 'saree' },
        { id: 2, name: 'Banarasi', slug: 'banarasi' },
        { id: 3, name: 'Kanjivaram', slug: 'kanjivaram' },
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
        label: cat.name,
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

    const [searchQuery, setSearchQuery] = React.useState('');
    const handleSearch = (value) => {
        if (value.trim()) {
            navigate(`/shop?search=${encodeURIComponent(value.trim())}`);
            setSearchQuery(''); // Clear after search
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
                                src="/assets/images/logo.jpg"
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
                            {!location.pathname.startsWith('/admin') && (
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
                title="ESHASILK"
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                className="mobile-drawer"
            >
                <ul className="mobile-nav-links">
                    {navItems.map(item => (
                        <li key={item.key} onClick={() => setMobileMenuOpen(false)}>
                            <Link to={item.path}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </Drawer>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </Header>
    );
};

export default Navbar;
