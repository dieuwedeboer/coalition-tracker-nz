export type CommitmentRecord = {
  Category: string;
  Commitment: string;
  Party: string;
  Status: number | bool;
  References: string;
  Tags: string[];
  LobbyFor: string;
  LobbyAgainst: string;
  Notes: string;
  Metadata: string;
};
