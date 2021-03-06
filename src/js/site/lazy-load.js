export default function initLazyLoading() {
	const observerOptions = {
		threshold: 0.3
	};

	const lazyImages = [...document.querySelectorAll('picture[data-lazy]')];
	const lazyImageObserver = getLazyImageObserver(observerOptions);
	lazyImages.forEach(lazyImage => {
		let observable = lazyImage.parentElement;
		if (lazyImage.parentElement.offsetHeight > window.innerHeight) {
			observable = lazyImage;
		}
		lazyImageObserver.observe(observable);
	});

	const lazyIframes = [...document.querySelectorAll('iframe[data-lazy]')];
	const lazyIframeObserver = getLazyIframeObserver(observerOptions);
	lazyIframes.forEach(lazyIframe => {
		lazyIframeObserver.observe(lazyIframe);
	});
}

function getLazyImageObserver(options) {
	const intersectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const lazyImage = entry.target.querySelector('[data-lazy]') || entry.target;
				[...lazyImage.querySelectorAll('[data-srcset]')].forEach(source => {
					source.srcset = source.dataset.srcset;
					if (source.tagName === 'IMG') {
						source.addEventListener('load', () => {
							lazyImage.removeAttribute('data-lazy');
						});
					}
				});
				intersectionObserver.unobserve(entry.target);
			}
		});
	}, options);
	return intersectionObserver;
}

function getLazyIframeObserver(options) {
	const intersectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.src = entry.target.dataset.srcsetIframe;
				entry.target.addEventListener('load', () => {
					entry.target.removeAttribute('data-lazy');
				});
				intersectionObserver.unobserve(entry.target);
			}
		});
	}, options);
	return intersectionObserver;
}
