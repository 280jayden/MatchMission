import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import type { Organization } from '../types/organization';
import { GetBatchResponse } from '../types/api';
import { useLocation } from 'react-router-dom';
import ProfileResult from '../components/ProfileResult';
import { API_URL } from '../config';
import LoadingText from '../components/LoadingText';

function Result() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const justCompleted = Boolean(location.state?.justCompleted);

    // Fetch the user's matched organizations from the backend.
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

        setLoading(false)
    };

    useEffect(() => {
        getResults();
    }, []);

    if (loading) {
      return (
          <LoadingText text="Loading your results"></LoadingText>
      );
    }

    return (
        <div>
            {/* <p style={{ textAlign: 'center', marginBottom: '70px' }}>
                Based on your quiz responses, here are some organizations that
                might fit your preferences.
            </p> */}
            
            {justCompleted && (
              <>
                <h1 style={{ textAlign: 'center' }}>Results</h1>
                <ProfileResult /> 
                <h2 id="results-list">Recommended Organizations</h2>
              </>
              )}

            {!justCompleted && (
              <h1 style={{ textAlign: 'center' }}>Recommendations</h1>
            )}

            {/* DEBUG, DELETE LATER */}
            {/* <ProfileResult /> 
            <h2 style={{marginTop: "99px", textAlign: "center"}} id="results-list">Recommended Organizations</h2> */}
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
