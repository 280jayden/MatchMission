export type Organization = {
    ein: string;
    name: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
    profileUrl: string;
    location: string;
    primarySlug: string;
    slug: string;
    match_explanation: string;
    tags: string[];
}; // same as matches in api/user/results

export type Tag = {
    tagImageUrl: string;
    title: string;
};
