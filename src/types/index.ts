export type CommitmentRecord = {
  Category: string;
  Promise: string;
  Party: string;
  Status: number | '-1'; // -1 for failed
  Tags: string[];
  Metadata: string;
};
