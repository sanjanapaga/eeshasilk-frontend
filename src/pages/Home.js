import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Carousel, Layout, Typography, Button, Row, Col, Space } from 'antd';
import { ArrowRightOutlined, StarFilled, SafetyCertificateFilled, InstagramOutlined, TrophyOutlined, GlobalOutlined, FacebookFilled } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../features/products/productsSlice';
import './Home.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.list) || [];
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        // Intersection Observer for scroll entrance animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [products, featuredProducts]); // Re-run when dynamic content loads

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchProducts()).then((res) => {
            if (res.payload) {
                setFeaturedProducts(res.payload.slice(0, 4));
            }
        });
    }, [dispatch]);

    const CollectionSlide = ({ eyebrow, title, subtitle, image, align = 'left' }) => (
        <div className="hero-slide-item" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5), transparent), url(${image})` }}>
            <div className={`hero-slide-content slide-align-${align} fade-in-up`}>
                <span className="cursive-flourish">{eyebrow}</span>
                <Title level={1} className="slide-title decorative-title">{title}</Title>
                <Paragraph className="slide-subtitle">{subtitle}</Paragraph>
                <Button type="primary" size="large" className="boutique-btn" onClick={() => navigate('/shop')}>
                    EXPLORE COLLECTION <ArrowRightOutlined />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="home-boutique-wrapper">
            <div
                className="boutique-bg-overlay"
                style={{ backgroundImage: "url('/assets/images/boutique/heritage_silks.png')" }}
            ></div>
            {/* Hero Carousel with Curated Images */}
            <Carousel autoplay effect="fade" className="main-hero-carousel">
                <CollectionSlide
                    eyebrow="Signature"
                    title={<>Saree</>}
                    subtitle="Experience the royal luster of 100% pure Mysore Silk with authentic gold zari borders."
                    image="/assets/images/boutique/mysore_silk.png"
                />
                <CollectionSlide
                    eyebrow="Bridal"
                    title={<> Bridal lehengas</>}
                    subtitle="Exquisite gold-embroidered bridal lehengas with heavy flared bottoms and premium zari work."
                    image="http://www.riccoindia.com/cdn/shop/products/image_0134fc97-106c-403b-be6e-0f8fa20d7a22_1024x1024.jpg?v=1595700654"
                    align="right"
                />
                <CollectionSlide
                    eyebrow="Lustrous"
                    title={<>Silver Zari <br /> Collection</>}
                    subtitle="Heritage sarees woven with real silver-plated zari threads (150g - 250g Silver)."
                    image="http://www.banarasee.in/cdn/shop/files/IMG_0497_0c521767-3389-4ad8-810b-148b840e4c14.jpg?v=1731314650"
                />
                <CollectionSlide
                    eyebrow="Ethnic"
                    title={<>Premium <br /> Kurta</>}
                    subtitle="Sophisticated Tussar and premium Kurtas for the contemporary woman."
                    image="https://www.lovesummer.in/cdn/shop/files/teal-amaria-a-line-short-kurta-set-georgette-hand-embroidery-net-dupatta.jpg?v=1750411239&width=1080"
                    align="right"
                />
                <CollectionSlide
                    eyebrow="Accessories"
                    title={<>Boutique <br /> Bags</>}
                    subtitle="Zari-embroidered potli bags to complement your heritage ensemble."
                    image="https://m.media-amazon.com/images/I/511RKsDvU9L._AC_UY1000_.jpg"
                />
            </Carousel>

            {/* Heritage Weaves Immersive Showcase (with transition bridge) */}
            <div className="section-bridge-top"></div>
            <Content className="boutique-section heritage-showcase-bg">
                <div className="pattern-layer"></div>
                <div className="container-premium">
                    <div className="boutique-header text-center mb-100 scroll-reveal">
                        <span className="cursive-flourish">Heritage Weaves</span>
                        <Title level={2} className="boutique-title decorative-title text-white">The Banarasi vs Kanjivaram Narrative</Title>
                        <Paragraph className="premium-para-light max-w-700 mx-auto">
                            Two legendary traditions, one magnificent heritage. Explore the golden zari of the North
                            and the temple borders of the South.
                        </Paragraph>
                    </div>

                    <Row gutter={[80, 80]} align="middle">
                        <Col xs={24} lg={12} className="scroll-reveal delay-1">
                            <div className="story-card interact-gold" onClick={() => navigate('/shop?category=banarasi')}>
                                <div className="story-image" style={{ backgroundImage: 'url(/assets/images/boutique/banarasi_hero.png)' }}></div>
                                <div className="story-content">
                                    <Text className="weave-meta">THE ZARI OF BANARAS</Text>
                                    <Title level={3}>Lustrous Banarasi</Title>
                                    <Paragraph className="story-text">
                                        Handcrafted with pure gold and silver threads, our Banarasi collection
                                        features floral motifs (Butidars) and intricate Jal work.
                                    </Paragraph>
                                    <Button type="primary" className="boutique-btn-outline">SHOP BANARASI</Button>
                                </div>
                                <div className="story-hover-overlay">
                                    <span className="overlay-text">EXPLORE BANARASI</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} lg={12} className="scroll-reveal delay-2">
                            <div className="story-card interact-gold" onClick={() => navigate('/shop?category=kanjivaram')}>
                                <div className="story-image" style={{ backgroundImage: 'url(/assets/images/boutique/kanjivaram_hero.png)' }}></div>
                                <div className="story-content">
                                    <Text className="weave-meta">THE TEMPLE BORDERS OF KANCHIPURAM</Text>
                                    <Title level={3}>Royal Kanjivaram</Title>
                                    <Paragraph className="story-text">
                                        Known for its heavy silk,silver and gold-dipped zari, these sarees feature
                                        the iconic 'Korvai' borders and 'Mallinagu' patterns.
                                    </Paragraph>
                                    <Button type="primary" className="boutique-btn-outline">SHOP KANJIVARAM</Button>
                                </div>
                                <div className="story-hover-overlay">
                                    <span className="overlay-text">EXPLORE KANJIVARAM</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
            <div className="section-bridge-bottom"></div>

            {/* Arched Category Gallery (Sinking better) */}
            <Content className="boutique-section gallery-grid-refined">
                <div className="container-premium">
                    <Row gutter={[40, 60]}>
                        <Col xs={24} sm={12} md={8} className="scroll-reveal">
                            <div className="gallery-frame-arched" onClick={() => navigate('/shop?category=mysore-silk')}>
                                <div className="frame-image" style={{ backgroundImage: 'url(/assets/images/boutique/mysore_silk.png)' }}></div>
                                <div className="frame-caption">
                                    <Title level={4}>Mysore Silks</Title>
                                    <Text>ROYAL LUSTER</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="scroll-reveal delay-1">
                            <div className="gallery-frame-arched" onClick={() => navigate('/shop?category=lehenga')}>
                                <div className="frame-image" style={{ backgroundImage: 'url(http://fabvilla.in/cdn/shop/files/image_fb338048-2ac4-4595-9f55-f92ecc4af2fc.jpg?v=1683386285)' }}></div>
                                <div className="frame-caption">
                                    <Title level={4}>Designer Lehengas</Title>
                                    <Text>BRIDAL TROUSSEAU</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="scroll-reveal delay-2">
                            <div className="gallery-frame-arched" onClick={() => navigate('/shop?category=kurta')}>
                                <div className="frame-image" style={{ backgroundImage: 'url(https://www.lovesummer.in/cdn/shop/files/teal-amaria-a-line-short-kurta-set-georgette-hand-embroidery-net-dupatta.jpg?v=1750411239&width=1080)' }}></div>
                                <div className="frame-caption">
                                    <Title level={4}>Silk Kurtas</Title>
                                    <Text>HERITAGE ETHNIC</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="scroll-reveal">
                            <div className="gallery-frame-arched" onClick={() => navigate('/shop?category=silver-plated')}>
                                <div className="frame-image" style={{ backgroundImage: 'url(https://m.media-amazon.com/images/I/71buvWlNL4L._AC_UY350_.jpg)' }}></div>
                                <div className="frame-caption">
                                    <Title level={4}>Silver Zari</Title>
                                    <Text>HEIRLOOM WEAVES</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="scroll-reveal delay-1">
                            <div className="gallery-frame-arched" onClick={() => navigate('/shop?category=bags')}>
                                <div className="frame-image" style={{ backgroundImage: 'url(http://yellowchimes.com/cdn/shop/files/tnqyaciuadpsof8fald3.jpg?v=1738352155)' }}></div>
                                <div className="frame-caption">
                                    <Title level={4}>Boutique Bags</Title>
                                    <Text>SILK ACCESSORIES</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="scroll-reveal delay-2">
                            <div className="gallery-frame-arched" onClick={() => navigate('/shop')}>
                                <div className="frame-image" style={{ backgroundImage: 'url(/assets/images/boutique/banarasi_hero.png)' }}></div>
                                <div className="frame-caption">
                                    <Title level={4}>The Signature List</Title>
                                    <Text>VIEW ALL TREASURES</Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
            <div className="section-bridge-bottom"></div>

            {/* The Curated Boutique Edit (Replaced generic grid) */}
            <Content className="boutique-section curated-edit-bg">
                <div className="container-premium">
                    <div className="boutique-header text-center mb-30 scroll-reveal">
                        <span className="cursive-flourish">Signature Edit</span>
                        <Title level={2} className="boutique-title decorative-title">Handpicked Masterpieces</Title>
                        <Paragraph className="premium-para max-w-700 mx-auto mb-0">
                            A curated selection of our most exquisite weaves, chosen for their unparalleled artistry and timeless appeal.
                        </Paragraph>
                    </div>

                    <Row gutter={[50, 80]} className="curated-grid" justify="center">
                        {featuredProducts.length > 0 ? featuredProducts.slice(0, 4).map((product, index) => (
                            <Col xs={24} sm={12} lg={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        )) : (
                            <Col span={24} className="text-center">
                                <Paragraph className="premium-para">Our master weavers are currently curating new treasures. Check back soon!</Paragraph>
                            </Col>
                        )}
                    </Row>

                    <div className="text-center mt-20 scroll-reveal">
                        <Button type="primary" size="large" className="boutique-btn-wide" onClick={() => navigate('/shop')}>
                            VIEW ALL TREASURES
                        </Button>
                    </div>
                </div>
            </Content>

            {/* The Art of the Loom Section (Final Polish) */}
            <div className="legacy-section craft-background">
                <div className="container-premium">
                    <Row align="middle" gutter={[80, 80]}>
                        <Col xs={24} md={12} className="legacy-text-col scroll-reveal">
                            <div className="legacy-content">
                                <span className="cursive-flourish">Handcrafted</span>
                                <Title level={2} className="decorative-title">Art of the Loom: <br /> Authenticity Woven In</Title>
                                <Paragraph className="premium-para">
                                    Every EESHA SILKS creation is a collaborative journey with master weavers across India.
                                    As an <strong>Authorized Silk Mark User</strong>, we guarantee that each thread in your saree is
                                    100% pure natural silk, verified by the Central Silk Board.
                                </Paragraph>

                                <div className="legacy-perks">
                                    <div className="perk-item">
                                        <TrophyOutlined className="perk-icon" />
                                        <div>
                                            <Text strong>AWARD WINNING ARTISANS</Text>
                                            <Paragraph>Directly sourced from master weavers</Paragraph>
                                        </div>
                                    </div>
                                    <div className="perk-item">
                                        <GlobalOutlined className="perk-icon" />
                                        <div>
                                            <Text strong>GLOBAL BOUTIQUE PRESENCE</Text>
                                            <Paragraph>Authenticity verified and shipped worldwide</Paragraph>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={12} className="legacy-image-col scroll-reveal delay-1">
                            <div className="art-gallery-frame">
                                <div className="art-image-inner" style={{ backgroundImage: 'url(/assets/images/boutique/handloom_craft.png)' }}></div>
                                <div className="craft-badge-floating">
                                    <SafetyCertificateFilled />
                                    <span>SILK MARK CERTIFIED</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Newsletter & Social Combined */}

            {/* Newsletter */}
            <div className="boutique-newsletter">
                <div className="container-narrow">
                    <div className="newsletter-card text-center" style={{ padding: '40px 20px', backgroundColor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                        {/* Social Links */}
                        <div style={{ marginBottom: '20px', marginTop: '10px' }}>
                            <span style={{ fontSize: '14px', letterSpacing: '3px', color: '#8B0000', display: 'block', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '700' }}>
                                💕 Follow Our Journey
                            </span>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', width: '100%' }}>
                                <a
                                    href="https://www.instagram.com/eeshasilks?utm_source=qr&igsh=ajh3OGdidG9hZXJo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="boutique-btn-outline"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#333',
                                        border: '1px solid #e0e0e0',
                                        padding: '12px 30px',
                                        background: 'white',
                                        borderRadius: '4px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        letterSpacing: '1px',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        margin: '10px'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <InstagramOutlined style={{ fontSize: '18px' }} /> INSTAGRAM
                                </a>
                                {/* Facebook removed */}
                            </div>
                        </div>

                        {/* Contact */}
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', maxWidth: '400px', margin: '0 auto' }}>
                            <Paragraph style={{ fontSize: '15px', color: '#888' }}>
                                <Text strong style={{ color: '#555' }}>❓ Any queries?</Text><br />
                                We’re just an email away → <a href="mailto:eeshasilkss@gmail.com" style={{ color: '#8B0000', fontWeight: '600' }}>eeshasilkss@gmail.com</a>
                            </Paragraph>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
