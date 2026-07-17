import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import { useAuth } from '../components/AuthProvider';
import type { Organization } from '../types/organization';
import WeightsRadarChart from '../components/WeightsRadarChart';
import "../styles/ProfileResult.css";

function ProfileResult() {
    const { weights } = useAuth();

    function scrollToResults() {
        document.getElementById('results-list')?.scrollIntoView();
    }

    useEffect(() => {}, []);

    return (
        <>
        <h3 style={{ textAlign: 'center', marginBottom: '70px' }}>
                    Based on your quiz responses, this is how we scored your
                    preferences.
                </h3>
        <div className="profile-result-container">
            <div className="profile-result-left">
                <p>AI generated paragraph here</p>
                <button onClick={scrollToResults}
                    className="result-button"
                >SHOW ME<br/>MY MATCHES</button>

                    {/* <div className="tag-container">
                {tags?.map((tag) => (
                    <AttributeTag
                    key={tag.title}
                    title={tag.title}
                    tagImageUrl={tag.tagImageUrl}
                    />
                ))}
                </div> */}
            </div>

            <div className="result-weight-chart">
                <WeightsRadarChart weights={weights} />
                <div className="cat-description-container">
                    <p>some descriptions</p>
                    <p>some descriptions</p>
                    <p>some descriptions</p>
                    {/* map: for the weights, we want to pull their Name and their description in a paragraph element */}
                </div>
            </div>
        </div>
        </>
    );
}

export default ProfileResult;
