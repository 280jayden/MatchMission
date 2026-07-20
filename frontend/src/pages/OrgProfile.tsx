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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#4CAF50", "#F44336", "#2196F3", "#FF9800"];

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

    const pieData = org?.propublica?.latestFiling
      ? [
          {
            name: "Revenue",
            value: org.propublica.latestFiling.totalRevenue,
          },
          {
            name: "Expenses",
            value: org.propublica.latestFiling.totalExpenses,
          },
          {
            name: "Assets",
            value: org.propublica.latestFiling.totalAssets,
          },
          {
            name: "Liabilities",
            value: org.propublica.latestFiling.totalLiabilities,
          },
        ]
      : [];

    return (
        <div>
            <div className="profile-header">
                
                {/* LEFT COLUMN */}
                <div className="profile-left">
                    <h1>{org.name}</h1>
                    {/* TAGS */}
                    <div className="tag-container">
                        {tags?.map((tag) => (
                            <AttributeTag
                                key={tag.title}
                                title={tag.title}
                                tagImageUrl={tag.tagImageUrl}
                            />
                        ))}
                    </div>

                    {/* PROPUBLICA INFO */}
                    <h3>Why trust them?</h3>
                    <p>
                      {org.propublica != null ? "Verified Nonprofit Status" : "Not Verified"}
                    </p>
                    <p>
                      {(org.propublica.filing_count > 0) ? "Public IRS Filings Available" : "Public IRS Filings Unavailable"}
                    </p>
                    <p>
                      {org.propublica.latestFiling.totalExpenses != null ? "Transparent Expense Reporting" : "No Transparent Expense Reporting"}
                    </p>

                    <p>IRS Verified 501(c)({org.propublica.subsectionCode})</p>

                    <p>Founded:</p>
                    <p>{org.propublica.foundedDate}</p>
                    <p>Latest IRS Filing:</p>
                    <p>{org.propublica.latestFiling.year} Form (SOMETHING)</p>

                    <p>Total Revenue</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      
                        data={org.propublica.historicalRevenue}
                        // margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis 
                          tickFormatter={(value) =>
                          `$${(value / 1_000_000_000).toFixed(1)}B`
                          }
                        />
                        <Tooltip
                          formatter={(value: number) =>
                          `$${value.toLocaleString()}`
                        } />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorUv)"
                          animationBegin={200}
                          animationDuration={1300}
                        />
                      </AreaChart>
                    </ResponsiveContainer>

                    <p>Financial Stability</p>
                    <p>Assets vs. Liabilities</p>
                    
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={100}
                          label
                        >
                          {pieData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>

                </div>
                
                {/* RIGHT COLUMN */}
                <div className="profile-right">
                    <button onClick={() => navigate('/result')}>Back</button>
                            
                    {/* COVER IMG */}
                    <img
                        src={resizeImage({ url: org.coverImageUrl }) || logo}
                        alt="organization logo"
                        className="orgprof-img"
                    />
                    
                    {/* BUTTONS */}
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

                    {/* DESCRIPTION */}
                    <div>
                        <h3>Based in {org.location}</h3>
                        <p>{org.description}</p>
                    </div>

                    {/* NEWS LINKS */}
                </div>
            </div>
        </div>
    );
}

export default OrgProfile;
