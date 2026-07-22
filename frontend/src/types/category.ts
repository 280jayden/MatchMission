/**
 * Represents a nonprofit category used for organization matching.
 *
 * Contains the category identifier, display information, description,
 * and associated image used throughout the application.
 */

export type Category = {
    tag: string;
    name: string;
    description: string;
    tagImageUrl: string;
};
