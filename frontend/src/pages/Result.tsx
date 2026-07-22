import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import type { Organization } from '../types/organization';
import { GetBatchResponse } from '../types/api';
import { useLocation } from 'react-router-dom';
import ProfileResult from '../components/ProfileResult';
import { API_URL } from '../config';
import LoadingText from '../components/LoadingText';

/**
 * Results page displaying personalized nonprofit recommendations.
 *
 * Fetches the user's matched organizations from the backend and displays
 * recommended nonprofits using OrgCard components. When the user has just
 * completed the mission quiz, also displays their profile result summary.
 *
 * State:
 * - orgs: List of nonprofit organizations matched to the user.
 * - loading: Tracks whether recommendation data is being fetched.
 *
 * Uses navigation state to determine whether to show the full results view
 * after quiz completion or the recommendations-only view.
 */
function Result() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const justCompleted = Boolean(location.state?.justCompleted);

    /**
     * Fetches the user's matched organizations.
     *
     * Retrieves personalized nonprofit recommendations from the backend and
     * updates the page with the returned organizations.
     */
    const getResults = async () => {
        const response = await fetch(`${API_URL}/api/user/results`, {
            method: 'GET',
            credentials: 'include',
        });

        const data: GetBatchResponse = await response.json();

        if (response.ok && 'matches' in data) {
            setOrgs(data.matches);
        } else if ('error' in data) {
            console.log(data.error);
        }

        setLoading(false);
    };

    useEffect(() => {
        getResults();
    }, []);

    if (loading) {
        return <LoadingText text="Loading your results"></LoadingText>;
    }

    return (
        <div className="page-background">
            {justCompleted && (
                <>
                    <h1 style={{ textAlign: 'center' }}>Results</h1>
                    <ProfileResult />
                    <h2
                        style={{ marginTop: '99px', textAlign: 'center' }}
                        id="results-list"
                    >
                        Recommended Organizations
                    </h2>
                </>
            )}

            {!justCompleted && (
                <h1 style={{ textAlign: 'center' }}>Recommendations</h1>
            )}

            <div className="card-container">
                {orgs.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>
                        No organizations found. (Your interests may be too
                        niche.)
                    </p>
                ) : (
                    orgs.map((org, index) => (
                        <OrgCard
                            key={org.ein}
                            org={org}
                            isBestMatch={index < 3}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Result;
