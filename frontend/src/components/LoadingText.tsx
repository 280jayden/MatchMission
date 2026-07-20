import { useEffect, useState } from 'react';
import "../styles/LoadingText.css";

type LoadingTextProps = {
    text?: string;
};

function LoadingText({ text = 'Loading' }: LoadingTextProps) {
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
        <div className="loading-container">
            <h2 className="loading-text">
                {text}
                {dots}
            </h2>
        </div>
    );
}

export default LoadingText;
