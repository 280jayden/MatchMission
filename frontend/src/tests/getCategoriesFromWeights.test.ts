import { describe, it, expect } from 'vitest';
import {
    getCategoriesFromWeights,
    getCategoriesFromTags,
} from '../utils/getCategoriesFromWeights';
import categories from '../data/categories.json';

describe('getCategoriesFromWeights', () => {
    it('returns empty array if weights is defined', () => {
        expect(getCategoriesFromWeights(undefined)).toEqual([]);
    });

    it('returns empty array if weights is null', () => {
        expect(getCategoriesFromWeights(null)).toEqual([]);
    });

    it('returns matching categories', () => {
        const weights = {
            [categories[0].tag]: 10,
            [categories[1].tag]: 5,
        };

        const result = getCategoriesFromWeights(weights);

        expect(result).toEqual([categories[0], categories[1]]);
    });
});

describe('getCategoriesFromTags', () => {
    it('returns empty array if tags is defined', () => {
        expect(getCategoriesFromTags(undefined)).toEqual([]);
    });

    it('returns empty array if tags is null', () => {
        expect(getCategoriesFromTags(null)).toEqual([]);
    });

    it('returns only matching categories', () => {
        const result = getCategoriesFromTags([
            categories[0].tag,
            categories[2].tag,
        ]);
        expect(result).toEqual([categories[0], categories[2]]);
    });

    it('ignores invalid tags', () => {
        const result = getCategoriesFromTags([categories[0].tag, 'faketag']);
        expect(result).toEqual([categories[0]]);
    });

    it('returns empty array if no tags match', () => {
        const result = getCategoriesFromTags([
            'none',
            'of',
            'us',
            'are',
            'real',
        ]);
        expect(result).toEqual([]);
    });
});
