export type VoteType = 'yes' | 'no' | 'abstain' | 'not-voting';

export interface Resolution {
  id: string;
  date: string;
  session?: string;
  subjects?: string;
  title: string;
  result: 'Adopted' | 'Vetoed' | 'Rejected';
  summary: {
    yes: number;
    no: number;
    abstain: number;
  };
  // Mapping of identifiers (country codes/names) to their vote
  votes: Record<string, VoteType>;
}

// Some common country numeric codes for mock data
const USA = '840';
const RUS = '643';
const CHN = '156';
const GBR = '826';
const FRA = '250';
const IND = '356';
const BRA = '076';
const JPN = '392';
const DEU = '276';
const ZAF = '710';

export const gaMockData: Resolution[] = [];

export const scMockData: Resolution[] = [
  {
    id: 'S/RES/2722',
    date: '2024-01-10',
    title: 'Maintenance of international peace and security',
    result: 'Adopted',
    summary: { yes: 11, no: 0, abstain: 4 },
    votes: {
      [USA]: 'yes', [RUS]: 'abstain', [CHN]: 'abstain', [GBR]: 'yes', [FRA]: 'yes',
      [JPN]: 'yes', [BRA]: 'yes'
    }
  },
  {
    id: 'S/2024/173',
    date: '2024-02-20',
    title: 'Ceasefire in Middle East conflict zone',
    result: 'Vetoed',
    summary: { yes: 13, no: 1, abstain: 1 },
    votes: {
      [USA]: 'no', // Veto
      [RUS]: 'yes', [CHN]: 'yes', [GBR]: 'abstain', [FRA]: 'yes',
      [JPN]: 'yes', [BRA]: 'yes', [ZAF]: 'yes'
    }
  },
  {
    id: 'S/2024/233',
    date: '2024-03-22',
    title: 'Humanitarian access and temporary halt of hostilities',
    result: 'Vetoed',
    summary: { yes: 11, no: 3, abstain: 1 },
    votes: {
      [USA]: 'yes', [RUS]: 'no', // Veto
      [CHN]: 'no', // Veto
      [GBR]: 'yes', [FRA]: 'yes', [JPN]: 'yes', [BRA]: 'yes'
    }
  },
  {
    id: 'S/RES/2728',
    date: '2024-03-25',
    title: 'Demand for immediate ceasefire for the month of Ramadan',
    result: 'Adopted',
    summary: { yes: 14, no: 0, abstain: 1 },
    votes: {
      [USA]: 'abstain', [RUS]: 'yes', [CHN]: 'yes', [GBR]: 'yes', [FRA]: 'yes',
      [JPN]: 'yes', [BRA]: 'yes', [DEU]: 'yes', [IND]: 'not-voting' // Example of not participating
    }
  }
];
