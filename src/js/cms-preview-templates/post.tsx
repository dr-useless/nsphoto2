import * as React from "react";
import * as CMS from "netlify-cms-core";
import * as format from "date-fns/format";

export default class PostPreview extends React.Component<CMS.PreviewTemplateComponentProps> {
  render() {
    const {entry, widgetFor, getAsset} = this.props;
    const image = getAsset(entry.getIn(["data", "featured_image"]));

    return (
      <>
        <article>
          <section>
            <h1>{ entry.getIn(["data", "title"])}</h1>
            <div className="metadata light">
              <p>{ format(entry.getIn(["data", "date"]), "ddd, MMM D, YYYY") }</p>
              <p>Read in x minutes</p>
            </div>
            <p>{ entry.getIn(["data", "description"]) }</p>
            { image && <img src={ image.url } alt={ entry.getIn(["data", "title"])} /> }
          </section>
          <section>
            { widgetFor("body") }
          </section>
        </article>
      </>
    );
  }
}