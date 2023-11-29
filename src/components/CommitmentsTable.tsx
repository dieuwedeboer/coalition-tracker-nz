import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const CommitmentsTable = ({ data }) => {
  const styleTableContainer = {
    overflowX: 'initial',
  }

  const styleTableHead = {
    '.MuiTableCell-head': {
      fontWeight: 'bold',
    }
  }

  return (
    <TableContainer component={Paper} sx={styleTableContainer}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead sx={styleTableHead}>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Commitment</TableCell>
            <TableCell>Party</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Lobby For</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.Category}</TableCell>
              <TableCell>{record.Commitment}</TableCell>
              <TableCell>{record.Party}</TableCell>
              <TableCell>{record.Status}</TableCell>
              <TableCell>{record.LobbyFor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommitmentsTable;
