import { useEffect, useState } from 'react';
import '../styles/LoadingText.css';

type LoadingTextProps = {
    text?: string;
    fullscreen?: boolean;
};

function LoadingText({
    text = 'Loading',
    fullscreen = true,
}: LoadingTextProps) {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={fullscreen ? 'loading-fullscreen' : 'loading-inline'}>
            <h2 className="loading-text">
                {text}
                {dots}
            </h2>
        </div>
    );
}

export default LoadingText;
