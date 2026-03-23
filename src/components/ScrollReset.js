import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollReset component that scrolls the window to the top 
 * whenever the route (pathname) changes.
 */
const ScrollReset = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top of the page on route change
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollReset;
