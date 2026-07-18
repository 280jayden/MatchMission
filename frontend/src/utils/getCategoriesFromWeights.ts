import categories from "../data/categories.json"
import type { UserWeights } from "../types/user"
import type { Category } from "../types/category"

export function getCategoriesFromWeights(
    weights?: UserWeights | null
): Category[] {
    if (!weights) return [];

    const userTags = Object.keys(weights);

    const correspCats = userTags.map((tag) => {
        return categories.find((category) => category.tag === tag);
    })

    const validCats = correspCats.filter(
        (category): category is Category => Boolean(category)
    );

    return validCats
}
