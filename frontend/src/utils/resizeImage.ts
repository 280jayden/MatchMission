/**
 * Configuration options for resizing an image URL.
 *
 * Props:
 * - url: Original Cloudinary image URL.
 * - size: Desired width and height of the resized image.
 */
type resizeImgProps = {
    url?: string;
    size?: number;
};

/**
 * Resizes a Cloudinary image URL to a square image.
 *
 * Applies Cloudinary transformations to fill and crop the image while
 * maintaining the requested dimensions. Returns an empty string if no URL
 * is provided.
 *
 * Params:
 * - url: Cloudinary image URL to resize.
 * - size: Target image dimension (defaults to 600px).
 *
 * Returns:
 * - Resized Cloudinary image URL or an empty string if the URL is missing.
 */
export function resizeImage({ url, size = 600 }: resizeImgProps) {
    if (!url) return '';

    const parts = url.split('/');

    if (parts.length > 7) {
        parts[6] = `c_lfill,w_${size},h_${size},dpr_2`;
        parts[7] = `c_crop,ar_${size}:${size}`;
    } else {
        console.log('not a valid cloudinary url');
    }

    return parts.join('/');
}
