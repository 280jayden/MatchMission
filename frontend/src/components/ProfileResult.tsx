import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
// import { useAuth } from '../components/AuthProvider';
import type { Organization } from '../types/organization';
import WeightsRadarChart from '../components/WeightsRadarChart';

function ProfileResult() {
    // const { user } = useAuth();

    function scrollToResults() {
        document.getElementById('results-list')?.scrollIntoView();
    }

    useEffect(() => {}, []);

    return (
        <div>
            <h3 style={{ textAlign: 'center', marginBottom: '70px' }}>
                Based on your quiz responses, this is how we scored your
                preferences.
            </h3>
            <p>AI generated paragraph here</p>
            <button onClick={scrollToResults}>SHOW ME MY MATCHES</button>

            {/* <div className="tag-container">
        {tags?.map((tag) => (
            <AttributeTag
            key={tag.title}
            title={tag.title}
            tagImageUrl={tag.tagImageUrl}
            />
        ))}
        </div> */}

            <div>
                <WeightsRadarChart />
                <div>
                    <p>some descriptions</p>
                    <p>some descriptions</p>
                    <p>some descriptions</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileResult;
