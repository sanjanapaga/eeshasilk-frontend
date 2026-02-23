import React, { useEffect } from 'react';
import { Row, Col, Typography, Form, Input, Button, message, Card, Select } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';
import api from '../api';
import './Contact.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        message.loading({ content: 'Sending message...', key: 'contact' });

        try {
            const response = await api.post('messages', values);

            if (response.status === 200 || response.status === 201) {
                message.success({ content: 'Message sent successfully! We will get back to you soon.', key: 'contact', duration: 4 });
                form.resetFields();
            } else {
                throw new Error(response.data?.message || 'Failed to send');
            }
        } catch (error) {
            console.error('Contact error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
            message.error({ content: errorMsg, key: 'contact' });
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-header">
                <div className="container">
                    <Title level={1} style={{ color: 'white', marginBottom: 8 }}>Contact Us</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
                        We'd love to hear from you. Here's how you can reach us.
                    </Paragraph>
                </div>
            </div>

            <div className="container contact-content">
                <Row gutter={[48, 48]}>
                    {/* Contact Info */}
                    <Col xs={24} md={10}>
                        <div className="contact-info-card fade-in-up">
                            <Title level={3}>Get in Touch</Title>
                            <Paragraph style={{ marginBottom: 32 }}>
                                Have a question about a product, order, or just want to say hello?
                                Our team is here to assist you.
                            </Paragraph>

                            <div className="info-item">
                                <div className="info-icon"><PhoneOutlined /></div>
                                <div>
                                    <Text strong>Call Us</Text>
                                    <div>+91 94804 42903</div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Mon-Sat, 10am - 8pm</Text>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon"><MailOutlined /></div>
                                <div>
                                    <Text strong>Email Us</Text>
                                    <div>eeshasilkss@gmail.com</div>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon"><EnvironmentOutlined /></div>
                                <div>
                                    <Text strong>Visit Us</Text>
                                    <div>Railway Mens HBCS limited layout, <br />AYAPPA ENCLAVE.25, 2nd stage, <br />Mallathahalli, Bengaluru, <br />Karnataka 560110</div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <iframe
                                title="map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15546.908756586326!2d77.50293247507662!3d12.964722487350485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d84f8867375%3A0x599028960107779f!2sEesha%20Silks!5e0!3m2!1sen!2sin!4v1707312345678!5m2!1sen!2sin"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </Col>

                    {/* Contact Form */}
                    <Col xs={24} md={14}>
                        <Card className="contact-form-card fade-in-up" bordered={false}>
                            <Title level={3} style={{ marginBottom: 24 }}>Send a Message</Title>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                size="large"
                                autoComplete="off"
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="name"
                                            label="Your Name"
                                            rules={[{ required: true, message: 'Please enter your name' }]}
                                        >
                                            <Input placeholder="John Doe" autoComplete="new-password" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email Address"
                                            rules={[
                                                { required: true, message: 'Please enter your email' },
                                                { type: 'email', message: 'Please enter a valid email' }
                                            ]}
                                        >
                                            <Input placeholder="john@example.com" autoComplete="new-password" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="subject"
                                    label="Subject"
                                    rules={[{ required: true, message: 'Please select a subject' }]}
                                >
                                    <Select placeholder="Select the reason for your message">
                                        <Select.Option value="General Inquiry">General Inquiry</Select.Option>
                                        <Select.Option value="Order Status">Order Status</Select.Option>
                                        <Select.Option value="Product Customization">Product Customization</Select.Option>
                                        <Select.Option value="Returns & Exchanges">Returns & Exchanges</Select.Option>
                                        <Select.Option value="Others">Others</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="message"
                                    label="Message"
                                    rules={[{ required: true, message: 'Please enter your message' }]}
                                >
                                    <TextArea rows={5} placeholder="How can we help you?" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" icon={<SendOutlined />} block>
                                        Send Message
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div >
    );
};

export default Contact;
