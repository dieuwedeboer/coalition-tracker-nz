import Papa from 'papaparse';
import { CommitmentRecord } from '../types';
import data from '../data/data.csv';

export const fetchCommitmentData = async (): Promise<CommitmentRecord[]> => {
  // Process and transform the data as needed
  console.log(data);
  const processedData = data.map((row: any) => ({
    ...row,
    Tags: row.Tags ? row.Tags.split(',') : [],
    Status: parseInt(row.Status ?? 0),
  }));

  return processedData;
};
