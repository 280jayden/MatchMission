import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import { useAuth } from '../components/AuthProvider';
import type { Organization } from '../types/organization';
import { FavoritesResponse } from '../types/api';
import WeightsRadarChart from '../components/WeightsRadarChart';
import { API_URL } from '../config';
import { getCategoriesFromWeights } from '../utils/getCategoriesFromWeights';
import AttributeTag from '../components/AttributeTag';

function Profile() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const { user, weights } = useAuth();
    const userCategories = getCategoriesFromWeights(weights);

    const getResults = async () => {
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
    };

    useEffect(() => {
        //so we can get results when it starts
        getResults();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Profile</h1>
            {user && <p>Welcome, {user.name}</p>}
            {/* preferences section */}
            <WeightsRadarChart weights={weights} />

            <div>
                <h3 style={{ textAlign: 'center' }}>Your Main Categories</h3>
                <div >
                    {userCategories.map((category) => (
                        <AttributeTag
                        key={category.tag}
                        title={category.name}
                        tagImageUrl={category.tagImageUrl}
                        />
                        ))}
                </div>
            </div>

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
