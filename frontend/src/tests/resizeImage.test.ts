import { describe, it, expect } from 'vitest';
import { resizeImage } from '../utils/resizeImage';

/**
 * Tests for the resizeImage utility function.
 *
 * Verifies that image URLs are correctly transformed for Cloudinary resizing,
 * handles missing or empty URLs, and applies default or custom image sizes.
 */

describe('resizeImage', () => {
    it('returns empty string if url is undefined', () => {
        expect(resizeImage({})).toBe('');
    });

    it('returns empty string if url is empty string', () => {
        expect(resizeImage({ url: '' })).toBe('');
    });

    it('uses default size (600) if no size is defined', () => {
        const url =
            'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';

        const result = resizeImage({ url });
        expect(result).toContain('c_lfill,w_600,h_600,dpr_2');
        expect(result).toContain('c_crop,ar_600:600');
    });

    it('uses provided size', () => {
        const url =
            'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg';

        const result = resizeImage({ url, size: 200 });
        expect(result).toContain('c_lfill,w_200,h_200,dpr_2');
        expect(result).toContain('c_crop,ar_200:200');
    });
});
