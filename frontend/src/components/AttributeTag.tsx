import '../styles/AttributeTag.css';

/**
 * Displays an organization's attribute as a tag with an icon and label.
 *
 * Props:
 * - title: The text displayed inside the attribute tag.
 * - tagImageUrl: The URL of the icon displayed alongside the tag text.
 */

type AttributeTagProps = {
  title: string;
  tagImageUrl: string;
};

function AttributeTag({ title, tagImageUrl }: AttributeTagProps) {
  return (
    <div className="tag">
      <img src={tagImageUrl} className="tag-img" alt="tag image"></img>
      <p className="tag-text">{title}</p>
    </div>
  );
}

export default AttributeTag;
