export type Organization = {
    ein: string;
    name: string;
    description: string;
    logoUrl: string;
    coverImageUrl: string;
    websiteUrl: string;
    profileUrl: string;
    location: string;
    primarySlug: string;
    slug: string;
    match_explanation: string;
    propublica: propublicaInfo;
}; // same as matches in api/user/results

export type propublicaInfo = {
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

    filing_count: number;
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
