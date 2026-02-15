import React from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import './Login.css';

const { Title, Paragraph } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const result = await dispatch(loginUser({
                email: values.email,
                password: values.password
            })).unwrap();

            const isAdminUser = result.role === 'admin';
            message.success(isAdminUser ? 'Admin login successful!' : 'Login successful!');
            navigate(isAdminUser ? '/admin' : '/');
        } catch (error) {
            message.error(error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Card className="login-card glass">
                    <div className="login-header fade-in">
                        <Title level={2}>Welcome Back</Title>
                        <Paragraph className="login-subtitle">
                            Sign in to access your EESHA SILKS account
                        </Paragraph>
                        <Paragraph style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                            Admin login: admin@eeshasilks.com
                        </Paragraph>
                    </div>

                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        className="login-form"
                    >
                        <Form.Item
                            name="email"
                            label="Email or Username"
                            validateTrigger="onBlur"
                            rules={[
                                { required: true, message: 'Please enter your email or username' },
                            ]}
                            normalize={(value) => value.trim()}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your email or username"
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
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter your password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <div className="login-options">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="#forgot" className="forgot-link">
                                    Forgot password?
                                </a>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block className="login-button" loading={loading}>
                                Sign In
                            </Button>
                        </Form.Item>

                        <div className="login-footer">
                            <Paragraph>
                                Don't have an account? <Link to="/register" className="register-link">Sign up</Link>
                            </Paragraph>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
