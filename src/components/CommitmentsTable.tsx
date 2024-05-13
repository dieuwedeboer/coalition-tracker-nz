import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CommitmentsTable = ({ data }) => {
  /**
   * Sort order based on table column header clicking.
   */
  const [orderBy, setOrderBy] = useState('Status');
  const [order, setOrder] = useState('desc');

  const dateSortFunction = (a, b, orderBy) => {

    const dateA =  a[orderBy] ? new Date(a[orderBy].split('/').reverse().join('/')) : null;
    const dateB =  b[orderBy] ? new Date(b[orderBy].split('/').reverse().join('/')) : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    if (isNaN(dateA) || isNaN(dateB)) return 0;

    return order === 'asc' ? dateA - dateB : dateB - dateA;
  };

  const sortedData = [...data].sort((a, b) => {
    // Date-based sorting.
    if (orderBy === 'Due' || orderBy === 'Updated') {
      return dateSortFunction(a, b, orderBy);
    }
    // Alphabetical sorting.
    const isAsc = order === 'asc';
    return (isAsc ? 1 : -1) * (a[orderBy] < b[orderBy] ? -1 : 1);
  });

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * Table styles.
   */
  const theme = useTheme();

  const styleTableContainer = {
    overflowX: 'initial',
  }

  const styleTableHead = {
    '.MuiTableCell-head': {
      fontWeight: 'bold',
    }
  }

  const getStyleTableRow = (status) => {
    switch (status) {
      case 0: // Not Started
        return { };
      case 100: // Complete
        return { backgroundColor: theme.palette.success.dark };
      case -1: // Failed
        return { backgroundColor: theme.palette.error.dark };
      default: // In Progress
        return { backgroundColor: theme.palette.info.dark };
    }
  };

  /**
   * Table compontent.
   */
  return (
    <TableContainer component={Paper} sx={styleTableContainer}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead sx={styleTableHead}>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'Category'}
                direction={orderBy === 'Category' ? order : 'asc'}
                onClick={() => handleRequestSort('Category')}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>Commitment</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'Party'}
                direction={orderBy === 'Party' ? order : 'asc'}
                onClick={() => handleRequestSort('Party')}
              >
                Party
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'Status'}
                direction={orderBy === 'Status' ? order : 'asc'}
                onClick={() => handleRequestSort('Status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'Updated'}
                direction={orderBy === 'Updated' ? order : 'asc'}
                onClick={() => handleRequestSort('Updated')}
              >
                Updated
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'Due'}
                direction={orderBy === 'Due' ? order : 'asc'}
                onClick={() => handleRequestSort('Due')}
              >
                Due
              </TableSortLabel>
            </TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Lobbying For</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((record, index) => (
            <TableRow key={index} sx={getStyleTableRow(record.Status)}>
              <TableCell>{record.Category}</TableCell>
              <TableCell>
                {record.Commitment}
                {record.References && (
                  <Typography component="div" variant="caption">
                    [Reference] {record.References}
                  </Typography>
                )}
                {record.Notes && (
                  <Typography component="div" variant="caption">
                    [Notes] {record.Notes}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{record.Party}</TableCell>
              <TableCell>{record.Status}%</TableCell>
              <TableCell>{record.Updated}</TableCell>
              <TableCell>{record.Due}</TableCell>
              <TableCell>{record.Tags}</TableCell>
              <TableCell>{record.LobbyFor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommitmentsTable;
