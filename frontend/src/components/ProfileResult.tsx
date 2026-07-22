import { useAuth } from '../components/AuthProvider';
import type { Organization } from '../types/organization';
import WeightsRadarChart from '../components/WeightsRadarChart';
import '../styles/ProfileResult.css';
import { getCategoriesFromWeights } from '../utils/getCategoriesFromWeights';
import AttributeTag from './AttributeTag';

/**
 * Displays the user's quiz result summary.
 *
 * Shows the user's preference explanation, category matches, and weight
 * visualization generated from their quiz responses. Provides navigation to
 * the recommended organizations section after viewing their results.
 *
 * Uses authentication state to access the user's preference weights and
 * generated explanation.
 */
function ProfileResult() {
    const { weights, explanation } = useAuth();
    const userCategories = getCategoriesFromWeights(weights);

    /**
     * Scrolls the page to the recommended organizations section.
     *
     * Used by the "Show Me My Matches" button to navigate users from their
     * profile results to their nonprofit recommendations.
     */
    function scrollToResults() {
        document.getElementById('results-list')?.scrollIntoView();
    }

    return (
        <>
            <h3 style={{ textAlign: 'center', marginBottom: '70px' }}>
                Based on your quiz responses, this is how we scored your
                preferences.
            </h3>
            <div className="profile-result-container">
                <div className="profile-result-left">
                    {explanation ? (
                        <p>{explanation}</p>
                    ) : (
                        <p>No description generated for user.</p>
                    )}

                    <button onClick={scrollToResults} className="result-button">
                        SHOW ME
                        <br />
                        MY MATCHES
                    </button>

                    <div>
                        <h3 style={{ textAlign: 'center' }}>
                            Your Main Categories
                        </h3>
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
                                <strong>{category.name}:</strong>{' '}
                                {category.description}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileResult;
