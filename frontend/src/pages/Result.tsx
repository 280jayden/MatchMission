import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import type { Organization } from '../types/organization';
import { GetBatchResponse } from '../types/api';
import { useLocation } from 'react-router-dom';
import ProfileResult from '../components/ProfileResult';
import { API_URL } from '../config';

function Result() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const location = useLocation();
    const justCompleted = Boolean(location.state?.justCompleted);

    // Fetch the user's matched organizations from the backend.
    const getResults = async () => {
        const response = await fetch(`${API_URL}/api/get_batch`, {
            method: 'GET',
            credentials: 'include',
        });

        const data: GetBatchResponse = await response.json();

        if (response.ok && 'nonprofits' in data) {
            setOrgs(data.nonprofits);
        } else if ('error' in data) {
            console.log(data.error);
        }
    };

    useEffect(() => {
        getResults();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Results</h1>
            {/* <p style={{ textAlign: 'center', marginBottom: '70px' }}>
                Based on your quiz responses, here are some organizations that
                might fit your preferences.
            </p> */}
            
            {/* {justCompleted && (
              <>
                <ProfileResult /> 
                <h2 id="results-list">Recommended Organizations</h2>
              </>
              )} */}
            {/* DEBUG, DELETE LATER */}
            
            <ProfileResult /> 
            <h2 id="results-list">Recommended Organizations</h2>
            {/* DEBUG, DELETE LATER */}
            <div className="card-container">
                {orgs.map((org, index) => (
                    <OrgCard key={org.ein} org={org} isBestMatch={index < 3} />
                ))}
            </div>
        </div>
    );
}

export default Result;
