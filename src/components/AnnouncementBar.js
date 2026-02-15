import React from 'react';
import { TagFilled } from '@ant-design/icons';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    return (
        <div className="announcement-bar">
            <div className="announcement-content">
                <span>✨ Free Shipping on all orders above ₹2000</span>
                <span className="separator">•</span>
                <span><TagFilled /> Festival Sale is Live! Flat 20% OFF using code <strong style={{ color: '#D4AF37' }}>ESHA20</strong></span>
                <span className="separator">•</span>
                <span>🚚 Express Delivery Available </span>
            </div>
        </div>
    );
};

export default AnnouncementBar;
