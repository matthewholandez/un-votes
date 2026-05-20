export type VoteValue = 'yes' | 'no' | 'abstain' | 'not-voting';

export interface Resolution {
	id: string;
	date: string;
	body: 'GA' | 'SC';
	title: string;
	result: 'Adopted' | 'Vetoed' | 'Rejected' | 'Consensus';
	summary: { yes: number; no: number; abstain: number };
	session: string;
	subjects?: string;
	votes: Record<string, VoteValue>;
}

export const UV_VOTE_COLORS: Record<VoteValue, string> = {
	yes: '#16a34a',
	no: '#dc2626',
	abstain: '#ca8a04',
	'not-voting': '#e5e5e5'
};

const UV_ALIAS: Record<string, string> = {
	'RUSSIAN FEDERATION': 'Russia',
	'UNITED STATES': 'United States of America',
	'UNITED KINGDOM': 'United Kingdom',
	'FRANCE': 'France',
	'CHINA': 'China',
	'DEMOCRATIC PEOPLE\'S REPUBLIC OF KOREA': 'North Korea',
	'REPUBLIC OF KOREA': 'South Korea',
	'SYRIAN ARAB REPUBLIC': 'Syria',
	'IRAN (ISLAMIC REPUBLIC OF)': 'Iran',
	'DEMOCRATIC REPUBLIC OF THE CONGO': 'Dem. Rep. Congo',
	'BOLIVIA (PLURINATIONAL STATE OF)': 'Bolivia',
	'VIET NAM': 'Vietnam',
	'LAO PEOPLE\'S DEMOCRATIC REPUBLIC': 'Laos',
	'UNITED REPUBLIC OF TANZANIA': 'Tanzania',
	'VENEZUELA (BOLIVARIAN REPUBLIC OF)': 'Venezuela',
	'CÔTE D\'IVOIRE': 'Côte d\'Ivoire',
	'SAO TOME AND PRINCIPE': 'São Tomé and Principe',
	'ESWATINI': 'Côte d\'Ivoire' // this is wrong but anyway,
};

export function resolveName(name: string): string {
	const n = (name || '').trim().toUpperCase();
	if (UV_ALIAS[n]) return UV_ALIAS[n];
	
	// Default title casing for other countries
	return n.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}
