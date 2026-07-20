import { useEffect, useState } from 'react';

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
        <h2 style={{ textAlign: 'center' }}>
            {text}
            {dots}
        </h2>
    );
}

export default LoadingText;
