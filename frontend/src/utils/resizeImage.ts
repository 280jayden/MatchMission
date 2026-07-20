type resizeImgProps = {
    url?: string;
    size?: number;
};

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
