import React, { useEffect } from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './About.css';

const { Title, Paragraph } = Typography;

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="about-hero-content fade-in-up">
                    <span className="cursive-flourish">Our Story</span>
                    <Title level={1} className="about-title">Weaving Tradition <br /> Into Elegance</Title>
                </div>
            </div>

            {/* Main Content */}
            <div className="container about-content">
                <Row gutter={[60, 60]} align="middle">
                    <Col xs={24} md={12} className="fade-in-up">
                        <div className="about-image-frame">
                            <img
                                src="https://images.unsplash.com/photo-1610030469841-1126348429e4?q=80&w=2574&auto=format&fit=crop"
                                alt="Eesha Silks Authentic Saree"
                                className="about-image"
                                onError={(e) => { e.target.src = '/assets/images/boutique/mysore_silk.png' }}
                            />
                            <div className="frame-border"></div>
                        </div>
                    </Col>
                    <Col xs={24} md={12} className="fade-in-up">
                        <div className="about-text-content">
                            <Title level={2} className="section-title">Welcome to Eesha Silks</Title>
                            <Paragraph className="about-para">
                                Eesha Silks is a Bengaluru-based saree boutique located in Mallathahalli, offering a graceful blend of traditional South Indian weaves and modern designs.
                            </Paragraph>
                            <Paragraph className="about-para">
                                Inspired by Karnataka’s rich textile heritage, our collection includes carefully handpicked sarees crafted for elegance, comfort, and quality.
                            </Paragraph>
                            <Paragraph className="about-para">
                                From everyday wear to festive and bridal occasions, Eesha Silks is dedicated to helping every woman feel confident and beautiful in what she wears.
                            </Paragraph>

                            <Button type="primary" size="large" className="mt-4" onClick={() => navigate('/shop')}>
                                Explore Our Collection
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Values Section */}
                <div className="values-section mt-80 text-center">
                    <span className="cursive-flourish-small">Why Choose Us</span>
                    <Title level={2} className="section-title mb-60">The Eesha Promise</Title>

                    <Row gutter={[40, 40]}>
                        <Col xs={24} md={8}>
                            <div className="value-card">
                                <div className="value-icon">✨</div>
                                <Title level={4}>Authenticity</Title>
                                <Paragraph>
                                    Directly sourced from master weavers to ensure 100% pure silk and genuine craftsmanship.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="value-card">
                                <div className="value-icon">💎</div>
                                <Title level={4}>Quality</Title>
                                <Paragraph>
                                    Handpicked designs that pass our rigorous quality checks for fabric and finish.
                                </Paragraph>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="value-card">
                                <div className="value-icon">🤝</div>
                                <Title level={4}>Service</Title>
                                <Paragraph>
                                    Personalized attention to help you find the perfect drape for your special moments.
                                </Paragraph>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default About;
