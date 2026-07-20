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
}; // same as matches in api/user/results

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

export type HistoricalRevenue = {
    year: number;
    revenue: number;
};

export type Tag = {
    tagImageUrl: string;
    title: string;
};
