import { useState, useEffect } from 'react';
import OrgCard from '../components/OrgCard';
import { useAuth } from '../components/AuthProvider';
import type { Organization } from '../types/organization';
import WeightsRadarChart from '../components/WeightsRadarChart';
import "../styles/ProfileResult.css";
import categories from "../data/categories.json";
import { getCategoriesFromWeights } from '../utils/getCategoriesFromWeights';
import AttributeTag from './AttributeTag';

function ProfileResult() {
    const { weights } = useAuth();
    const userCategories = getCategoriesFromWeights(weights);

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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin scelerisque, lectus pellentesque sagittis blandit, ipsum sem condimentum quam, eu pellentesque diam dolor id magna. Cras tellus tortor, euismod eget imperdiet vitae, sollicitudin nec elit. Praesent sit amet sagittis dolor. In eu vehicula urna. Maecenas eget venenatis ex. Pellentesque nec hendrerit purus, sit amet volutpat justo. Praesent in hendrerit enim, at aliquet risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas sed velit a est rutrum malesuada. Etiam id erat pretium, mollis purus eu, mollis lectus. Aliquam eleifend nisi nec justo convallis, vel consequat dolor dictum. Fusce risus odio, dignissim id euismod sed, tristique at nunc. Sed suscipit magna at justo mattis, semper maximus purus malesuada. In vel sem ac lectus vehicula tincidunt sit amet vel lacus.</p>

                <button onClick={scrollToResults}
                    className="result-button"
                >SHOW ME<br/>MY MATCHES</button>
                
                <div>
                    <h3 style={{ textAlign: 'center' }}>Your Main Categories</h3>
                    <div className="result-tag-container">
                        {userCategories.map((category) => (
                            <AttributeTag
                            key={category.tag}
                            title={category.name}
                            tagImageUrl={category.tagImageUrl}
                            />
                            ))}
                    </div>
                </div>
            </div>

            <div className="result-weight-chart">
                <WeightsRadarChart weights={weights} />
                <div className="cat-description-container">
                    {userCategories.map((category) => (
                        <p key={category.tag}>
                        <strong>{category.name}:</strong> {category.description}
                      </p>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}

export default ProfileResult;
