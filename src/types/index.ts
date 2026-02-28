export type CommitmentRecord = {
  Category: string;
  Commitment: string;
  Party: string;
  Status: number | boolean;
  Updated: string;
  Due: string;
  References: string;
  Tags: string[];
  Notes: string;
  Metadata: string;
};
