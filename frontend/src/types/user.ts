export type User = {
    user_id: string;
    has_taken_quiz: boolean;
    name: string;
};

export type UserWeights = {
    [cause: string]: number;
};
