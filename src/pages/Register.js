import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { parseError } from '../utils';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import './Register.css';

const { Title, Paragraph } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await dispatch(registerUser({
                name: values.name,
                email: values.email,
                password: values.password,
                password_confirm: values.confirmPassword
            })).unwrap();

            message.success('Registration successful! Please login to continue.');
            navigate('/login');
        } catch (error) {
            message.error(parseError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <Card className="register-card glass">
                    <div className="register-header fade-in">
                        <Title level={2}>Join EESHA SILKS</Title>
                        <Paragraph className="register-subtitle">
                            Create your account to start shopping
                        </Paragraph>
                    </div>

                    <Form
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        className="register-form"
                    >
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[
                                { required: true, message: 'Please enter your full name' },
                                { min: 2, message: 'Name must be at least 2 characters' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your full name"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            validateTrigger="onBlur"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email address' },
                            ]}
                            normalize={(value) => value.trim()}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter your email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 6, message: 'Password must be at least 6 characters' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Create a password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm your password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block className="register-button" loading={loading}>
                                Create Account
                            </Button>
                        </Form.Item>

                        <div className="register-footer">
                            <Paragraph>
                                Already have an account? <Link to="/login" className="login-link">Sign in</Link>
                            </Paragraph>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
