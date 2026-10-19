import { format } from 'date-fns';
import { CommitmentRecord } from '../types';
import { getStatusValue } from './status';

export const parseDate = (value: string | null | undefined) => {
  if (!value) return null;
  const [day, month, year] = value.split('/').map(part => parseInt(part, 10));
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value: string | null | undefined) => {
  const date = parseDate(value);
  return date ? format(date, 'd MMMM yyyy') : '';
};

export const isPastDue = (record: CommitmentRecord, today = new Date()) => {
  const status = getStatusValue(record.Status);
  if (status >= 100 || status < 0) return false;
  const due = parseDate(record.Due);
  return due !== null && due < today;
};

const TIER_ONE_DOMAINS = ['beehive.govt.nz', 'parliament.nz', 'legislation.govt.nz', 'gazette.govt.nz'];
const TIER_TWO_DOMAINS = [
  'rnz.co.nz',
  'nzherald.co.nz',
  'stuff.co.nz',
  'thepost.co.nz',
  'thepress.co.nz',
  'newsroom.co.nz',
  '1news.co.nz',
  'newstalkzb.co.nz',
  'thespinoff.co.nz',
  'businessdesk.co.nz',
  'interest.co.nz',
  'teaonews.co.nz',
];
const TIER_THREE_DOMAINS = [
  'national.org.nz',
  'act.org.nz',
  'nzfirst.nz',
  'twitter.com',
  'x.com',
  'facebook.com',
  'wikipedia.org',
];

const matchesDomain = (host: string, domains: string[]) =>
  domains.some(domain => host === domain || host.endsWith(`.${domain}`));

export interface ReferenceInfo {
  url: string;
  domain: string;
  tier: 1 | 2 | 3 | null;
}

export const getReferenceInfo = (references: string | null | undefined): ReferenceInfo | null => {
  const url = references?.match(/https?:\/\/\S+/)?.[0];
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace(/^www\d?\./, '');
    const tier =
      matchesDomain(host, TIER_ONE_DOMAINS) || host.endsWith('.govt.nz') ? 1 :
      matchesDomain(host, TIER_TWO_DOMAINS) ? 2 :
      matchesDomain(host, TIER_THREE_DOMAINS) ? 3 : null;
    return { url, domain: host, tier };
  } catch {
    return null;
  }
};
