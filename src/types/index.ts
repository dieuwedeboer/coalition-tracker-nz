export type CommitmentRecord = {
  Category: string;
  Commitment: string;
  Party: string;
  Status: number | bool;
  Updated: string;
  Due: string;
  References: string;
  Tags: string[];
  LobbyFor: string;
  LobbyAgainst: string;
  Notes: string;
  Metadata: string;
};
