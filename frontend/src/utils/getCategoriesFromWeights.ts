import categories from '../data/categories.json';
import type { UserWeights } from '../types/user';
import type { Category } from '../types/category';

export function getCategoriesFromWeights(
    weights?: UserWeights | null,
): Category[] {
    if (!weights) return [];

    const userTags = Object.keys(weights);

    return getCategoriesFromTags(userTags);
}

export function getCategoriesFromTags(tags?: string[] | null): Category[] {
  if (!tags) return [];
  const correspCats = tags.map((tag) => {
        return categories.find((category) => category.tag === tag);
    });

  return correspCats.filter((category): category is Category =>
        Boolean(category),
    );

}
