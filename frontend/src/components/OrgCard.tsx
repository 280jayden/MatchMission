import '../styles/OrgCard.css';
import StarButton from './StarButton';
import logo from '../assets/mm_logo.png';
import { useNavigate } from 'react-router-dom';
import { Organization } from '../types/organization';
import DonateButton from './DonateButton';
import { resizeImage } from '../utils/resizeImage';
import AttributeTag from '../components/AttributeTag';
import { getCategoriesFromTags } from '../utils/getCategoriesFromWeights';

type OrgCardProps = {
    org: Organization;
    forceStarred?: boolean;
    isBestMatch?: boolean;
};

function OrgCard({
    org,
    forceStarred = false,
    isBestMatch = false,
}: OrgCardProps) {
    /**
     * Displays a nonprofit organization summary card.
     *
     * Props:
     * - org: Organization object containing display information.
     * - forceStarred: Initial favorite state for the star button.
     */

    const navigate = useNavigate();

    const orgCategories = getCategoriesFromTags(org.tags);

    return (
        <div className="item-card org-card">
            <div className="org-top">
                <img
                    src={resizeImage({ url: org.logoUrl }) || logo}
                    alt={org.name}
                    className="org-img"
                />

                <div>
                    {isBestMatch && <h2>BEST MATCH!</h2>}
                    <h2>{org.name}</h2>
                    {org.location || org.locationAddress ? (
                        <h3>Based in {org.location || org.locationAddress}</h3>
                    ) : (
                        <h3>No location found.</h3>
                    )}
                    <p>{org.description}</p>

                    <div className="org-tag-container">
                        {orgCategories.map((category) => (
                            <img
                                key={category.tag}
                                src={category.tagImageUrl}
                                alt={category.name}
                                title={category.name}
                                className="org-tag-icon"
                            />
                        ))}
                    </div>
                </div>

                <div className="org-icons">
                    <StarButton ein={org.ein} initialStarred={forceStarred} />

                    {/* info button only shows on results that have a match explanation */}
                    {org.match_explanation && (
                        <div className="info-tooltip">
                            <span className="info-icon">ⓘ</span>
                            <span className="tooltip-text">
                                {org.match_explanation}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="org-bot">
                <button
                    onClick={() => navigate(`/org/${org.ein}`)}
                    className="norm-button"
                >
                    PROFILE
                </button>

                <button
                    onClick={() => {
                        const url = org.websiteUrl.startsWith('http')
                            ? org.websiteUrl
                            : `https://${org.websiteUrl}`;
                        window.open(url, '_blank');
                    }}
                    className="norm-button"
                    disabled={!org.websiteUrl}
                >
                    {org.websiteUrl ? 'THEIR WEBSITE' : 'NO WEBSITE'}
                </button>

                {/* <button
          onClick={() => {
            const url = org.profileUrl.startsWith('http')
              ? `${org.profileUrl}/donate`
              : `https://${org.profileUrl}/donate`;
            window.open(url, '_blank');
          }}
          className="norm-button"
          disabled={!org.profileUrl}
        >
          {org.profileUrl ? 'DONATE HERE' : 'NO DONATION LINK'}
        </button> */}

                <DonateButton slug={org.slug}></DonateButton>
            </div>
        </div>
    );
}

export default OrgCard;
