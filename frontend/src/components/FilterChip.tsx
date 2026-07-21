import '../styles/AttributeTag.css';

/**
 * Displays an organization's attribute as a tag with an icon and label.
 *
 * Props:
 * - title: The text displayed inside the attribute tag.
 * - tagImageUrl: The URL of the icon displayed alongside the tag text.
 */

type FilterChipProps = {
    title: string;
    tagImageUrl: string;
    isSelected: boolean;
    onSelect: () => void;
};

function FilterChip({
    title,
    tagImageUrl,
    isSelected,
    onSelect,
}: FilterChipProps) {
    return (
        <button
            type="button"
            className={`tag ${isSelected ? 'tag-selected' : ''}`}
            onClick={onSelect}
            aria-pressed={isSelected}
        >
            <img src={tagImageUrl} className="tag-img" alt="" />
            <span className="tag-text">{title}</span>
        </button>
    );
}

export default FilterChip;
