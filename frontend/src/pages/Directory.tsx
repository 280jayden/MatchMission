import AttributeTag from '../components/AttributeTag';
import categories from "../data/categories.json"
import "../styles/Directory.css"


function Directory() {
    return (
        <div className="directory-container">
            <div className="filter-bar">
                <h3>FILTERS</h3>
                {categories.map((category) => (
                        <AttributeTag
                        key={category.tag}
                        title={category.name}
                        tagImageUrl={category.tagImageUrl}
                        />
                        ))}
            </div>

            <div className="directory-orgs page-background">
              <h1>Directory</h1>
              <p>later........</p>
            </div>
        </div>
    );
}

export default Directory;
