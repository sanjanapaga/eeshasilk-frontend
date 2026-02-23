import React from 'react';
import { TagFilled } from '@ant-design/icons';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    return (
        <div className="announcement-bar">
            <div className="announcement-content">
                <span>✨ Free Shipping on all orders above ₹20000</span>
                <span className="separator">•</span>
                <span>🚚 Express Delivery Available </span>
            </div>
        </div>
    );
};

export default AnnouncementBar;
