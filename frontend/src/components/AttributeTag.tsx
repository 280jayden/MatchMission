import "../styles/AttributeTag.css"

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
