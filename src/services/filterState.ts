import { useEffect, useState } from 'react';
import { StatusBucket, STATUS_BUCKETS } from './status';

export type SortField = 'Category' | 'Party' | 'Status' | 'Updated' | 'Due';
export type ViewMode = 'table' | 'grid';

export interface FilterState {
  search: string;
  statuses: StatusBucket[];
  parties: string[];
  categories: string[];
  pastDue: boolean;
  sort: SortField;
  order: 'asc' | 'desc';
  view: ViewMode;
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  statuses: [],
  parties: [],
  categories: [],
  pastDue: false,
  sort: 'Status',
  order: 'desc',
  view: 'table',
};

const SORT_FIELDS: SortField[] = ['Category', 'Party', 'Status', 'Updated', 'Due'];
const STATUS_KEYS = STATUS_BUCKETS.map(bucket => bucket.key);

const readList = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? '').split(',').map(value => value.trim()).filter(Boolean);

const readFilters = (): FilterState => {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get('sort') as SortField;
  const order = params.get('order');
  const view = params.get('view');

  return {
    search: params.get('q') ?? '',
    statuses: readList(params, 'status').filter((s): s is StatusBucket => STATUS_KEYS.includes(s as StatusBucket)),
    parties: readList(params, 'party'),
    categories: readList(params, 'category'),
    pastDue: params.get('due') === 'past',
    sort: SORT_FIELDS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
    order: order === 'asc' || order === 'desc' ? order : DEFAULT_FILTERS.order,
    view: view === 'grid' || view === 'table' ? view : DEFAULT_FILTERS.view,
  };
};

const writeFilters = (filters: FilterState) => {
  const params = new URLSearchParams();
  if (filters.search) params.set('q', filters.search);
  if (filters.statuses.length) params.set('status', filters.statuses.join(','));
  if (filters.parties.length) params.set('party', filters.parties.join(','));
  if (filters.categories.length) params.set('category', filters.categories.join(','));
  if (filters.pastDue) params.set('due', 'past');
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort);
  if (filters.order !== DEFAULT_FILTERS.order) params.set('order', filters.order);
  if (filters.view !== DEFAULT_FILTERS.view) params.set('view', filters.view);

  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', url);
};

export const hasActiveFilters = (filters: FilterState) =>
  filters.search !== '' ||
  filters.statuses.length > 0 ||
  filters.parties.length > 0 ||
  filters.categories.length > 0 ||
  filters.pastDue;

export const useFilterState = () => {
  const [filters, setFilters] = useState<FilterState>(readFilters);

  useEffect(() => {
    writeFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handlePopState = () => setFilters(readFilters());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateFilters = (changes: Partial<FilterState>) => setFilters(prev => ({ ...prev, ...changes }));

  return [filters, updateFilters] as const;
};

export const toggleValue = <T,>(values: T[], value: T) =>
  values.includes(value) ? values.filter(v => v !== value) : [...values, value];
