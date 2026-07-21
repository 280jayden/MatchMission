import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import { useAuth } from '../components/AuthProvider';
import type { Organization } from '../types/organization';
import { FavoritesResponse } from '../types/api';
import WeightsRadarChart from '../components/WeightsRadarChart';
import { API_URL } from '../config';
import { getCategoriesFromWeights } from '../utils/getCategoriesFromWeights';
import AttributeTag from '../components/AttributeTag';
import '../styles/UserProfile.css';
import LoadingText from '../components/LoadingText';

function Profile() {
    const [loading, setLoading] = useState(true);
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const { user, weights, hasTakenQuiz } = useAuth();
    const userCategories = getCategoriesFromWeights(weights);

    const midpoint = Math.ceil(userCategories.length / 2);
    const leftCategories = userCategories.slice(0, midpoint);
    const rightCategories = userCategories.slice(midpoint);

    const getResults = async () => {
        try {
            const response = await fetch(`${API_URL}/api/favorites`, {
                method: 'GET',
                credentials: 'include',
            });

            const data: FavoritesResponse = await response.json();

            if (response.ok && 'favorites' in data) {
                console.log('yuh');
                setOrgs(data.favorites);
            } else if ('error' in data) {
                console.log(data.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        //so we can get results when it starts
        getResults();
    }, []);

    if (loading) {
        return <LoadingText text="Loading your profile" />;
    }

    console.log(hasTakenQuiz);

    return (
        <div className="page-background">
            <h1 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                Profile
            </h1>
            {user && (
                <p style={{ textAlign: 'center' }}>
                    Welcome, {user.name}! Here, you can find your main
                    preferences and all of your saved organizations.
                </p>
            )}

            {/* preferences section */}
            {hasTakenQuiz() ? (
                <div
                    className="preferences-card"
                    style={{ marginBottom: '3rem' }}
                >
                    <h2 className="preferences-header"> Your Preferences</h2>

                    <div className="preferences-body">
                        <div className="tag-column">
                            {leftCategories.map((category) => (
                                <AttributeTag
                                    key={category.tag}
                                    title={category.name}
                                    tagImageUrl={category.tagImageUrl}
                                />
                            ))}
                        </div>

                        <WeightsRadarChart weights={weights} />

                        <div className="tag-column">
                            {rightCategories.map((category) => (
                                <AttributeTag
                                    key={category.tag}
                                    title={category.name}
                                    tagImageUrl={category.tagImageUrl}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>
                    Take the quiz to see your preferences.{' '}
                </p>
            )}

            {/* saved orgs section */}
            <h2 style={{ textAlign: 'center' }}>Your Saved Organizations</h2>
            <div className="card-container">
                {orgs.length > 0 ? (
                    orgs.map((org) => (
                        <OrgCard key={org.ein} org={org} forceStarred={true} />
                    ))
                ) : orgs ? (
                    <p style={{ textAlign: 'center' }}>
                        No saved organizations
                    </p>
                ) : (
                    <p style={{ textAlign: 'center' }}>
                        Error fetching saved organizations
                    </p>
                )}
            </div>
        </div>
    );
}

export default Profile;
