import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [gaData, scData] = await Promise.all([
		fetch('/api/resolutions/ga').then(r => r.json()),
		fetch('/api/resolutions/sc').then(r => r.json())
	]);
	
	return {
		gaResolutions: gaData,
		scResolutions: scData
	};
};