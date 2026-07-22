import type { Organization, Tag, PropublicaInfo } from './organization';
/**
 * API response types used throughout the application.
 *
 * Defines the expected structures returned from backend endpoints including
 * authentication, user preferences, nonprofit data, quiz submissions, and
 * organization matching results.
 */

export type CurrentUserResponse = {
    user_id: string;
    has_taken_quiz: boolean;
};

export type UserWeightsResponse =
    | {
          success: true;
          weights: Record<string, number>;
          explanation: string | null;
      }
    | { error: string };

export type LogoutResponse = {
    success?: boolean;
    message?: string;
    error?: string;
};

export type LoginResponse = { success: true } | { error: string };

export type OrgProfileResponse =
    | {
          nonprofit: Organization;
          nonprofitTags: Tag[];
          propublica: PropublicaInfo;
      }
    | { error: string };

export type FavoritesResponse =
    { favorites: Organization[] } | { error: string };

export type QuizResponse = {
    questionId: number;
    answer: string | string[];
};

export type RegisterResponse = { success: true } | { error: string };

export type GetBatchResponse = { matches: Organization[] } | { error: string };

export type GetOrgsResponse =
    | {
          success: true;
          directory: Organization[];
      }
    | {
          success: false;
          error: string;
      };
