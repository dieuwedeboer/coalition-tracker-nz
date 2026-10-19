import Papa from 'papaparse';
import { CommitmentRecord } from '../types';
import data from '../data/data.csv';

export const fetchCommitmentData = async (): Promise<CommitmentRecord[]> => {
  // Process and transform the data as needed
  const processedData = data.map((row: any) => ({
    ...row,
    Tags: row.Tags ? row.Tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
    Status: parseInt(row.Status ?? 0),
  }));

  return processedData;
};
