import categories from '../data/categories.json';
import type { UserWeights } from '../types/user';
import type { Category } from '../types/category';

/**
 * Converts user preference weights into matching category objects.
 *
 * Extracts category tags from the user's weights and returns the
 * corresponding category data from the categories list.
 *
 * Params:
 * - weights: User preference weights mapped by category tag.
 *
 * Returns:
 * - List of matching categories.
 */
export function getCategoriesFromWeights(
    weights?: UserWeights | null,
): Category[] {
    if (!weights) return [];

    const userTags = Object.keys(weights);

    return getCategoriesFromTags(userTags);
}

/**
 * Finds category objects that match a list of category tags.
 *
 * Ignores tags that do not exist in the category data.
 *
 * Params:
 * - tags: Array of category tags to look up.
 *
 * Returns:
 * - List of matching category objects.
 */
export function getCategoriesFromTags(tags?: string[] | null): Category[] {
    if (!tags) return [];
    const correspCats = tags.map((tag) => {
        return categories.find((category) => category.tag === tag);
    });

    return correspCats.filter((category): category is Category =>
        Boolean(category),
    );
}
