export type VoteValue = 'yes' | 'no' | 'abstain' | 'not-voting';

export interface Resolution {
	id: string;
	date: string;
	body: 'GA' | 'SC';
	title: string;
	result: 'Adopted' | 'Vetoed' | 'Rejected';
	summary: { yes: number; no: number; abstain: number };
	session: string;
	votes: Record<string, VoteValue>;
}

export const UV_RESOLUTIONS: { GA: Resolution[]; SC: Resolution[] } = {
	GA: [
		{
			id: 'A/RES/79/12',
			date: '2024-12-03',
			body: 'GA',
			title:
				'Necessity of ending the economic, commercial and financial embargo imposed by the United States of America against Cuba',
			result: 'Adopted',
			summary: { yes: 187, no: 2, abstain: 1 },
			session: '79',
			votes: {
				'United States of America': 'no',
				Israel: 'no',
				Moldova: 'abstain'
			}
		}
	],
	SC: [
		{
			id: 'S/RES/2722',
			date: '2024-01-10',
			body: 'SC',
			title: 'Maintenance of international peace and security · Red Sea shipping',
			result: 'Adopted',
			summary: { yes: 11, no: 0, abstain: 4 },
			session: '2024',
			votes: {}
		},
		{
			id: 'S/2024/173',
			date: '2024-02-20',
			body: 'SC',
			title: 'Ceasefire in Middle East conflict zone',
			result: 'Vetoed',
			summary: { yes: 13, no: 1, abstain: 1 },
			session: '2024',
			votes: {
				'United States of America': 'no',
				Russia: 'yes',
				China: 'yes',
				'United Kingdom': 'abstain',
				France: 'yes',
				Japan: 'yes',
				Brazil: 'yes',
				Algeria: 'yes',
				Mozambique: 'yes',
				Switzerland: 'yes',
				Slovenia: 'yes',
				'Republic of Korea': 'yes',
				'Sierra Leone': 'yes',
				Guyana: 'yes',
				Ecuador: 'yes',
				Malta: 'yes'
			}
		}
	]
};

export const UV_SUMMARY = {
	GA: { total: 312, adopted: 287, vetoed: 25 },
	SC: { total: 64, adopted: 51, vetoed: 13 }
};

export const UV_VOTE_COLORS: Record<VoteValue, string> = {
	yes: '#16a34a',
	no: '#dc2626',
	abstain: '#ca8a04',
	'not-voting': '#e5e5e5'
};

const UV_ALIAS: Record<string, string> = {
	'Russian Federation': 'Russia',
	'United States': 'United States of America',
	USA: 'United States of America',
	UK: 'United Kingdom',
	DPRK: 'North Korea',
	"Democratic People's Republic of Korea": 'North Korea',
	'Republic of Korea': 'South Korea',
	'Syrian Arab Republic': 'Syria',
	'Iran (Islamic Republic of)': 'Iran',
	'Democratic Republic of the Congo': 'Dem. Rep. Congo',
	'Bolivia (Plurinational State of)': 'Bolivia',
	'Viet Nam': 'Vietnam',
	"Lao People's Democratic Republic": 'Laos',
	'United Republic of Tanzania': 'Tanzania'
};

export function resolveName(name: string): string {
	const n = (name || '').trim();
	return UV_ALIAS[n] || n;
}
