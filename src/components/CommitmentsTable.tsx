import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CommitmentRecord } from '../types';
import { fetchCommitmentData } from '../services/csvDataService';

const CommitmentsTable: React.FC = () => {
  const [commitments, setCommitments] = useState<CommitmentRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCommitmentData();
        setCommitments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="commitments table">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Promise</TableCell>
            <TableCell>Party</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Metadata</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commitments.map((commitment, index) => (
            <TableRow key={index}>
              <TableCell>{commitment.Category}</TableCell>
              <TableCell>{commitment.Promise}</TableCell>
              <TableCell>{commitment.Party}</TableCell>
              <TableCell>{commitment.Status}</TableCell>
              <TableCell>{commitment.Tags}</TableCell>
              <TableCell>{commitment.Metadata}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommitmentsTable;
