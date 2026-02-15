import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Input, Button, message, Form } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Title, Paragraph } = Typography;

const Footer = () => {
    return (
        <AntFooter className="footer">
            <div className="footer-container">
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={24} md={8}>
                        <div className="footer-section">
                            <Title level={3} className="footer-logo">EESHA SILKS</Title>
                            <Paragraph className="footer-description">
                                Discover the finest collection of luxury sarees and elegant dresses.
                                Handpicked designs that celebrate tradition and contemporary fashion.
                            </Paragraph>
                            <div className="social-icons">
                                <InstagramOutlined className="social-icon" />
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <div className="footer-section">
                            <Title level={4} className="footer-title">Quick Links</Title>
                            <ul className="footer-links">
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/shop">Shipping Policy</Link></li>
                                <li><Link to="/shop">Returns & Exchanges</Link></li>
                                <li><Link to="/shop">FAQ</Link></li>
                                <li><a href="/login">My Account</a></li>
                            </ul>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <div className="footer-section">
                            <Title level={4} className="footer-title">Contact Us</Title>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <PhoneOutlined className="contact-icon" />
                                    <span>+91 94804 42903</span>
                                </div>
                                <div className="contact-item">
                                    <MailOutlined className="contact-icon" />
                                    <span>eeshasilkss@gmail.com</span>
                                </div>
                            </div>

                        </div>
                    </Col>
                </Row>

                <div className="footer-bottom">
                    <Paragraph className="copyright">
                        © {new Date().getFullYear()} EESHA SILKS. All rights reserved.
                    </Paragraph>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;
