/**
 * Represents a user's account information and quiz status.
 *
 * Contains the user's identifier, name, and whether they have completed
 * the mission matching quiz.
 */
export type User = {
    user_id: string;
    has_taken_quiz: boolean;
    name: string;
};

/**
 * Represents a user's nonprofit preference weights.
 *
 * Maps category tags to numerical weights that represent the user's level
 * of interest or alignment with each cause.
 */
export type UserWeights = {
    [cause: string]: number;
};
