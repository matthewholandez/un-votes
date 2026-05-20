import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/resolutions/ga');
	const data = await res.json();
	return {
		resolutions: data
	};
};
