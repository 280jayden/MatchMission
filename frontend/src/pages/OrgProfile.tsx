import '../styles/OrgProfile.css';
import logo from '../assets/mm_logo.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Organization, Tag } from '../types/organization';
import { OrgProfileResponse } from '../types/api';
import AttributeTag from '../components/AttributeTag';
import DonateButton from '../components/DonateButton';
import { API_URL } from '../config';
import { resizeImage } from '../utils/resizeImage';

function OrgProfile() {
    const { ein } = useParams<{ ein: string }>();
    const [org, setOrg] = useState<Organization | null>(null);
    const [tags, setTags] = useState<Tag[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!ein) return;

        // Fetch organization details when the profile page loads
        // or when the EIN in the URL changes.
        const getOrg = async () => {
            try {
                const response = await fetch(`${API_URL}/api/org/${ein}`);
                const data: OrgProfileResponse = await response.json();

                console.log('API response:', data);

                if (response.ok && 'nonprofit' in data) {
                    setOrg(data.nonprofit);
                    setTags(data.nonprofitTags);
                } else if ('error' in data) {
                    console.log(data.error);
                }
            } finally {
                setLoading(false);
            }
        };

        getOrg();
    }, [ein]);

    if (loading) return <p>Loading...</p>;

    if (!org) return <p>Organization not found.</p>;

    return (
        <div>
            <div className="profile-header">
                <div className="profile-info">
                    <h2>{org.name}</h2>
                    <h3>Based in {org.location}</h3>
                    <p>{org.description}</p>
                    <h3>Tags:</h3>
                    <div className="tag-container">
                        {tags?.map((tag) => (
                            <AttributeTag
                                key={tag.title}
                                title={tag.title}
                                tagImageUrl={tag.tagImageUrl}
                            />
                        ))}
                    </div>

                    <div className="profile-bottom">
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

                        <DonateButton slug={org.primarySlug}></DonateButton>
                    </div>
                </div>

                <div className="profile-side">
                    <button onClick={() => navigate('/result')}>Back</button>

                    <img
                        src={resizeImage({ url: org.logoUrl }) || logo}
                        alt="organization logo"
                        className="orgprof-img"
                    />
                </div>
            </div>
        </div>
    );
}

export default OrgProfile;
