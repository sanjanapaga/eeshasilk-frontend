import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const { Title, Paragraph } = Typography;

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content fade-in">
                <Title level={1} className="hero-title">
                    Discover Timeless Elegance
                </Title>
                <Paragraph className="hero-subtitle">
                    Exquisite collection of luxury sarees and designer dresses
                </Paragraph>
                <Paragraph className="hero-description">
                    Handpicked selection of premium silk sarees, traditional wear, and contemporary designs
                </Paragraph>
                <div className="hero-buttons">
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate('/shop')}
                        className="hero-cta-primary"
                    >
                        Explore Collection
                    </Button>
                    <Button
                        size="large"
                        onClick={() => navigate('/shop')}
                        className="hero-cta-secondary"
                    >
                        View Sarees
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
