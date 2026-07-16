import type { Organization, Tag } from './organization';

export type CurrentUserResponse = {
  user_id: string;
  has_taken_quiz: boolean;
};

export type LogoutResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export type LoginResponse = { success: true } | { error: string };

export type OrgProfileResponse =
  { nonprofit: Organization, nonprofitTags: Tag[] } | { error: string };

export type FavoritesResponse =
  { favorites: Organization[] } | { error: string };

export type QuizResponse = {
  questionId: number;
  answer: string | string[];
};

export type RegisterResponse = { success: true } | { error: string };

export type GetBatchResponse =
  { nonprofits: Organization[] } | { error: string };
