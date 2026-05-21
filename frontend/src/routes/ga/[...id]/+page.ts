import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Resolution } from '$lib/mockData';

export const load: PageLoad = async ({ params, fetch }) => {
	const resId = params.id;
	
	const res = await fetch('/api/resolutions/ga');
	if (!res.ok) {
		throw error(500, 'Could not load resolutions');
	}
	
	const data: Resolution[] = await res.json();
	const resolution = data.find((r) => r.id === resId);
	
	if (!resolution) {
		throw error(404, 'Resolution not found');
	}
	
	return {
		resolution
	};
};
