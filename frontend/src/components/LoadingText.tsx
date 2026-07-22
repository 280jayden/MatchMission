import { useEffect, useState } from 'react';
import '../styles/LoadingText.css';

type LoadingTextProps = {
    text?: string;
    fullscreen?: boolean;
};

/**
 * Animated loading indicator component.
 *
 * Displays a customizable loading message with animated dots that update
 * periodically. Can be displayed either fullscreen or inline depending on
 * the provided props.
 *
 * Props:
 * - text: Message displayed before the animated dots.
 * - fullscreen: Determines whether the loader uses fullscreen or inline styling.
 */
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
