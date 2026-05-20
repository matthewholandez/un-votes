import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [gaRes, scRes] = await Promise.all([
		fetch('/api/resolutions/ga'),
		fetch('/api/resolutions/sc')
	]);
	const gaData = await gaRes.json();
	const scData = await scRes.json();
	return {
		gaResolutions: gaData,
		scResolutions: scData
	};
};
