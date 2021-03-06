import * as React from "react";
import { format } from "date-fns";

export default class AlbumPreview extends React.Component {
	render() {
		const {entry} = this.props;
		let images = entry.getIn(["data", "images"]);
		let videos = entry.getIn(["data", "videos"]);

		const videosTemplate = videos && videos.map((youtubeId) => {
			const youtubeIframeSrc = `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white`
			return (
				<>
					<div className="media-grid-item span span-3-2">
						<iframe src={youtubeIframeSrc} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
					</div>
				</>
			);
		});

		if (images && !Array.isArray(images)) {
			images = images.toArray();
		}

		const imagesTemplate = images && images.map(img => {
			let iterableImg = img;
			
			if (!Array.isArray(img)) {
				iterableImg = img.toArray();
			}

			const imageUrl = iterableImg.filter(i => i.indexOf('webp') > -1)[0];
			return (
			<>
				<div className="media-grid-item">
					<picture>
						<img src={imageUrl}/>
					</picture>
				</div>
			</>
			);
		});

		return (
			<>
				<article>
					<div className="media-grid album">
						<div className="media-grid-item">
							<h1>{ entry.getIn(["data", "title"])}</h1>
							<div className="metadata light">
								<p>{ format(entry.getIn(["data", "date"]), "yyyy-mm-dd") }</p>
							</div>
							<p>{ entry.getIn(["data", "description"]) }</p>
						</div>
						{ videosTemplate }
						{ imagesTemplate }
					</div>
				</article>
			</>
		);
	}
}