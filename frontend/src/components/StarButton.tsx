import { useState } from 'react';
import fullStar from '../assets/full_star.png';
import emptyStar from '../assets/empty_star.png';
import '../styles/OrgCard.css';
import { API_URL } from '../config';

/**
 * Toggle button for adding or removing an organization
 * from the user's favorites.
 *
 *  * Props:
 * - ein: Employer Identification Number of the organization.
 * - initialStarred: Whether the organization starts in the favorited state. Optional
 */

type StarButtonProps = {
    ein: string;
    initialStarred?: boolean;
};

function StarButton({ ein, initialStarred = false }: StarButtonProps) {
    const [starred, setStarred] = useState(initialStarred);

    async function handleStar() {
        const url = !starred ? `${API_URL}/api/favorite` : `${API_URL}/api/unfavorite`;

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ein: ein,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.error);
        } else {
            setStarred(!starred);
        }
    }

    return (
        <button onClick={handleStar} className="star-button">
            {starred ? (
                <img src={fullStar} alt="full star"></img>
            ) : (
                <img src={emptyStar} alt="empty star"></img>
            )}
        </button>
    );
}

export default StarButton;
