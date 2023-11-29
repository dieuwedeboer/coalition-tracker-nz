export type CommitmentRecord = {
  Category: string;
  Commitment: string;
  Party: string;
  Status: number | bool;
  Tags: string[];
  LobbyFor: string;
  LobbyAgainst: string;
  Notes: string;
  Metadata: string;
};
