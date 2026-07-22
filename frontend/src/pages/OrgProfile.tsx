import '../styles/OrgProfile.css';
import logo from '../assets/mm_logo.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Organization, Propublica, Tag } from '../types/organization';
import { OrgProfileResponse } from '../types/api';
import AttributeTag from '../components/AttributeTag';
import DonateButton from '../components/DonateButton';
import { API_URL } from '../config';
import { resizeImage } from '../utils/resizeImage';
import {
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Cell,
    Pie,
    PieChart,
} from 'recharts';
import LoadingText from '../components/LoadingText';

const reColors = ['#6E9056', '#86A96D'];
const alColors = ['#BBD5A8', '#DAEBCE'];

/**
 * Organization profile page displaying detailed nonprofit information.
 *
 * Fetches organization data using the EIN from the URL and displays the
 * organization's description, tags, verification information, financial
 * transparency data, and donation options.
 *
 * Includes financial visualizations from ProPublica data when available and
 * allows users to visit the organization's website or donate through
 * Every.org.
 *
 * State:
 * - org: The nonprofit organization being displayed.
 * - propub: IRS and financial information from ProPublica.
 * - tags: Category tags associated with the organization.
 * - loading: Tracks whether organization data is being fetched.
 */
function OrgProfile() {
    const { ein } = useParams<{ ein: string }>();
    const [org, setOrg] = useState<Organization | null>(null);
    const [propub, setPropub] = useState<Propublica | null>(null);
    const [tags, setTags] = useState<Tag[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!ein) return;

        /**
         * Fetches nonprofit profile data from the backend.
         *
         * Retrieves organization details, associated tags, and ProPublica financial
         * information using the organization's EIN from the URL.
         */
        const getOrg = async () => {
            try {
                const response = await fetch(`${API_URL}/api/org/${ein}`);
                const data: OrgProfileResponse = await response.json();

                console.log('API response:', data);

                if (response.ok && 'nonprofit' in data) {
                    setOrg(data.nonprofit);
                    setTags(data.nonprofitTags);
                    setPropub(data.propublica);
                } else if ('error' in data) {
                    console.log(data.error);
                }
            } finally {
                setLoading(false);
            }
        };

        getOrg();
    }, [ein]);

    if (loading) return <LoadingText />;

    if (!org) return <p>Organization not found.</p>;

    const revenueExpenseData = propub?.latestFiling
        ? [
              {
                  name: 'Revenue',
                  value: propub.latestFiling.totalRevenue ?? 0,
              },
              {
                  name: 'Expenses',
                  value: propub.latestFiling.totalExpenses ?? 0,
              },
          ]
        : [];

    const assetLiabilityData = propub?.latestFiling
        ? [
              {
                  name: 'Assets',
                  value: propub.latestFiling.totalAssets ?? 0,
              },
              {
                  name: 'Liabilities',
                  value: propub.latestFiling.totalLiabilities ?? 0,
              },
          ]
        : [];

    const hasRevenueExpense = revenueExpenseData.some(
        (item) => item.value != null,
    );

    const hasAssetLiability = assetLiabilityData.some(
        (item) => item.value != null,
    );

    return (
        <div className="page-background">
            <div className="profile-header">
                {/* LEFT COLUMN */}
                <div className="profile-left">
                    <h1 style={{ marginBottom: '0' }}>{org.name}</h1>
                    {/* TAGS */}
                    <div
                        className="exp-tag-container"
                        style={{ marginBottom: '15px' }}
                    >
                        {tags?.map((tag) => (
                            <AttributeTag
                                key={tag.title}
                                title={tag.title}
                                tagImageUrl={tag.tagImageUrl}
                            />
                        ))}
                    </div>

                    {/* PROPUBLICA INFO */}
                    {propub ? (
                        <>
                            <h3 style={{ marginBottom: '0' }}>
                                Why trust them?
                            </h3>
                            <div className="propublica-info">
                                <div className="propublica-text">
                                    <div>
                                        <p>
                                            {propub != null
                                                ? '✔ Verified Nonprofit Status'
                                                : '𐄂 Not Verified'}
                                        </p>
                                        <p>
                                            {(propub.filingsCount ?? 0) > 0
                                                ? '✔ Public IRS Filings Available'
                                                : '𐄂 Public IRS Filings Unavailable'}
                                        </p>
                                        <p>
                                            {propub.latestFiling
                                                ?.totalExpenses != null
                                                ? '✔ Transparent Expense Reporting'
                                                : '𐄂 No Transparent Expense Reporting'}
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                            IRS Verified 501(c)(
                                            {propub.subsectionCode ?? 'Unknown'}
                                            )
                                        </p>

                                        <p>
                                            Founded:{' '}
                                            {propub.foundedDate?.slice(0, 4) ??
                                                'Unknown'}
                                        </p>
                                        <p>
                                            {propub.latestFiling?.year != null
                                                ? `${propub.latestFiling.year} Form 990`
                                                : 'Latest Filing Year Unavailable'}
                                        </p>
                                        <p>
                                            {propub.latestFiling
                                                ?.executivecompensation != null
                                                ? `Executive Compensation: $${propub.latestFiling.executivecompensation}`
                                                : 'Executive Compensation Unavailable'}
                                        </p>
                                    </div>
                                </div>

                                {propub.historicalRevenue?.length > 0 && (
                                    <>
                                        <p>Total Revenue</p>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={180}
                                        >
                                            <AreaChart
                                                data={propub.historicalRevenue}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 30,
                                                    bottom: 10,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="colorUv"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#86A96D"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#86A96D"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="year"
                                                    tick={{ fontSize: 11 }}
                                                />

                                                <YAxis
                                                    width={80}
                                                    tick={{ fontSize: 11 }}
                                                    tickFormatter={(value) =>
                                                        `$${value.toLocaleString()}`
                                                    }
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: '12px',
                                                    }}
                                                    formatter={(value) =>
                                                        value != null
                                                            ? `$${Number(value).toLocaleString()}`
                                                            : 'N/A'
                                                    }
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#86A96D"
                                                    fillOpacity={1}
                                                    fill="url(#colorUv)"
                                                    animationBegin={200}
                                                    animationDuration={1300}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </>
                                )}

                                {hasRevenueExpense && (
                                    <>
                                        <p>Revenue v.s. Expenses</p>

                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart
                                                data={revenueExpenseData}
                                                layout="vertical"
                                                margin={{
                                                    top: 10,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 10,
                                                }}
                                            >
                                                <XAxis
                                                    type="number"
                                                    tickFormatter={(value) =>
                                                        `$${value.toLocaleString()}`
                                                    }
                                                    tick={{ fontSize: 11 }}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fontSize: 11 }}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: '10px',
                                                    }}
                                                    formatter={(value) =>
                                                        value != null
                                                            ? `$${Number(value).toLocaleString()}`
                                                            : 'N/A'
                                                    }
                                                />
                                                <Bar dataKey="value">
                                                    {revenueExpenseData.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    reColors[
                                                                        index
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </>
                                )}

                                {hasAssetLiability && (
                                    <>
                                        <p>Assets v.s. Liabilities</p>

                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart
                                                data={assetLiabilityData}
                                                layout="vertical"
                                                margin={{
                                                    top: 10,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 10,
                                                }}
                                            >
                                                <XAxis
                                                    type="number"
                                                    tickFormatter={(value) =>
                                                        `$${value.toLocaleString()}`
                                                    }
                                                    tick={{ fontSize: 11 }}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fontSize: 11 }}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        fontSize: '10px',
                                                    }}
                                                    formatter={(value) =>
                                                        value != null
                                                            ? `$${Number(value).toLocaleString()}`
                                                            : 'N/A'
                                                    }
                                                />
                                                <Bar dataKey="value">
                                                    {assetLiabilityData.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={index}
                                                                fill={
                                                                    alColors[
                                                                        index
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <p>
                            Unverified Organization. No tax information found.
                        </p>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="profile-right">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        BACK
                    </button>

                    {/* COVER IMG */}
                    <img
                        src={resizeImage({ url: org.logoUrl }) || logo}
                        alt="organization logo"
                        className="orgprof-img"
                    />

                    {/* BUTTONS */}
                    <div className="profile-actions">
                        <button
                            onClick={() => {
                                const url = org.websiteUrl?.startsWith('http')
                                    ? org.websiteUrl
                                    : `https://${org.websiteUrl}`;
                                window.open(url, '_blank');
                            }}
                            className="website-button"
                            disabled={!org.websiteUrl}
                        >
                            {org.websiteUrl ? 'THEIR WEBSITE' : 'NO WEBSITE'}
                        </button>

                        <DonateButton slug={org.primarySlug}></DonateButton>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        {org.location || org.locationAddress ? (
                            <h3>
                                Based in {org.location || org.locationAddress}
                            </h3>
                        ) : (
                            <h3>No location listed.</h3>
                        )}

                        <p>{org.description}</p>
                    </div>

                    {/* NEWS LINKS */}
                </div>
            </div>
        </div>
    );
}

export default OrgProfile;
