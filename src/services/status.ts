import { CommitmentRecord } from '../types';

export type StatusBucket = 'delivered' | 'advanced' | 'early' | 'not-started' | 'failed';

export interface StatusBucketInfo {
  key: StatusBucket;
  label: string;
  range: string;
}

export const STATUS_BUCKETS: StatusBucketInfo[] = [
  { key: 'delivered', label: 'Delivered', range: '100' },
  { key: 'advanced', label: 'Well Advanced', range: '50–90' },
  { key: 'early', label: 'Early Progress', range: '10–40' },
  { key: 'not-started', label: 'Not Started', range: '0' },
  { key: 'failed', label: 'Failed', range: '−1' },
];

const STATUS_COLOURS: Record<'light' | 'dark', Record<StatusBucket, string>> = {
  light: {
    delivered: '#2e7d32',
    advanced: '#01579b',
    early: '#3d9be0',
    'not-started': '#b0bec5',
    failed: '#c62828',
  },
  dark: {
    delivered: '#43a047',
    advanced: '#1976d2',
    early: '#64b5f6',
    'not-started': '#5f6b70',
    failed: '#e53935',
  },
};

export const getStatusColours = (mode: 'light' | 'dark') => STATUS_COLOURS[mode];

export const getStatusValue = (status: number | boolean) => (typeof status === 'boolean' ? 0 : status);

export const getStatusBucket = (status: number | boolean): StatusBucket => {
  const value = getStatusValue(status);
  if (value === 100) return 'delivered';
  if (value >= 50) return 'advanced';
  if (value > 0) return 'early';
  if (value < 0) return 'failed';
  return 'not-started';
};

export const getBucketInfo = (bucket: StatusBucket) =>
  STATUS_BUCKETS.find(info => info.key === bucket) as StatusBucketInfo;

export const getStatusLabel = (status: number | boolean) => getBucketInfo(getStatusBucket(status)).label;

export type BucketCounts = Record<StatusBucket, number>;

export const emptyCounts = (): BucketCounts => ({
  delivered: 0,
  advanced: 0,
  early: 0,
  'not-started': 0,
  failed: 0,
});

export const countBuckets = (records: CommitmentRecord[]): BucketCounts =>
  records.reduce((counts, record) => {
    counts[getStatusBucket(record.Status)] += 1;
    return counts;
  }, emptyCounts());
