import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loading from './Loading';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { return_book, setIssues } from './features/user/userSlice';
import { Button } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const issued_books = useSelector((state) => state.user.issues)
  const dispatch = useDispatch();
  const getIssuedBooks = async () => {
    const res = await axios.get('http://localhost:8000/api/issue_book', {
      'headers': {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    if (res.status === 200) {
      dispatch(setIssues(res.data))
    }
  }
  const returnBook = async (id, idx, data) => {
    const res = await axios.put(`http://localhost:8000/api/book/return/${id}`, {
    }, {
      'headers': {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    if (res.status === 201) {
      dispatch(return_book({ data: { ...data, returned: true, return_date: res.data.date }, idx: idx }))
    }
  }
  React.useEffect(() => {
    if (!issued_books) {
      getIssuedBooks()
      setLoading(false);
    }
  }, [])
  if (loading) {
    return <Loading />
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 380 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Book Name</StyledTableCell>
            <StyledTableCell align="left">Issued On</StyledTableCell>
            <StyledTableCell align="center">Return date</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issued_books && issued_books.map((row, idx) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.bookname}
              </StyledTableCell>
              <StyledTableCell align="left">{row.issue_date}</StyledTableCell>
              <StyledTableCell align="center">
                {row.returned ? row.return_date :
                  <Button onClick={() => returnBook(row.id, idx, row)}>Return</Button>
                }
              </StyledTableCell>
              <StyledTableCell align="center">{row.returned ? "Returned" : "Not Returned"}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}