/**
 * Represents a nonprofit organization returned from the backend.
 *
 * Contains organization details, matching information, donation links,
 * location data, associated tags, and financial information.
 */
export type Organization = {
    ein: string;
    name: string;
    description: string;
    logoUrl: string;
    coverImageUrl: string;
    websiteUrl: string;
    profileUrl: string;
    location: string;
    locationAddress: string;
    primarySlug: string;
    slug: string;
    match_explanation: string;
    propublica: PropublicaInfo;
    tags: string[];
};

/**
 * Represents nonprofit verification and financial information from ProPublica.
 *
 * Includes IRS classification details, filing history, latest financial data,
 * and historical revenue information.
 */
export type PropublicaInfo = {
    subsectionCode: number;
    nteeCode: string;
    foundedDate: string;

    latestFiling: {
        year: number;
        totalRevenue: number;
        totalExpenses: number;
        totalAssets: number;
        totalLiabilities: number;
    };

    filingsCount: number;
    historicalRevenue: HistoricalRevenue[];
};

/**
 * Represents an organization's revenue data for a specific year.
 */
export type HistoricalRevenue = {
    year: number;
    revenue: number;
};

/**
 * Represents a category tag associated with a nonprofit organization.
 *
 * Contains the tag image used for display and the tag title shown to users.
 */
export type Tag = {
    tagImageUrl: string;
    title: string;
};
