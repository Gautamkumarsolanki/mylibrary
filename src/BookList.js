import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Loading from './Loading';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { issue_book, setBooks, setIssues } from './features/user/userSlice';

export default function GutterlessList({ setView }) {
    const [genre, setGenre] = React.useState("All");
    const [loading, setLoading] = React.useState(true);
    const dispatch = useDispatch();
    const books = useSelector((state) => state.user.books)
    const issued_books = useSelector((state) => state.user.issues)

    const handleChange = (event) => {
        setGenre(event.target.value);
    };
    const getBooks = async () => {
        const res = await axios.get('http://localhost:8000/api/book', {
            'headers': {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        dispatch(setBooks(res.data))
    }
    const issueBook = async (id, name) => {
        if (!issued_books) {
            const res = await axios.get('http://localhost:8000/api/issue_book', {
                'headers': {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (res.status === 200) {
                dispatch(setIssues(res.data))
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].bookname === name && !res.data[i].returned) {
                        alert("You already issued this book and not returned it yet");
                        return;
                    }
                }
                const res = await axios.post('http://localhost:8000/api/issue_book', {
                    "id": id,
                    "name": name
                }, {
                    'headers': {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                dispatch(issue_book({id:res.data.id,bookname:name,returned:false,issue_date:res.data.date,return_date:""}))
                alert("Book issued successfully")
            }
        } else {
            for (let i = 0; i < issued_books.length; i++) {
                if (issued_books[i].bookname === name && !issued_books[i].returned) {
                    alert("You already issued this book and not returned it yet");
                    return;
                }
            }
            const res = await axios.post('http://localhost:8000/api/issue_book', {
                "id": id,
                "name": name
            }, {
                'headers': {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            dispatch(issue_book({id:res.data.id,bookname:name,returned:false,issue_date:res.data.date,return_date:""}))
            alert("Book issued successfully")
        }

    }
    React.useEffect(() => {
        getBooks();
        setLoading(false);
    }, [])
    if (loading) {
        return <Loading />
    }
    return (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>

            <List sx={{ width: '100%', maxWidth: 1200, bgcolor: 'background.paper' }}>
                <FormControl sx={{ mb: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Genre</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={genre}
                        label="Age"
                        onChange={handleChange}
                    >
                        <MenuItem value="All">
                            All
                        </MenuItem>
                        <MenuItem value={'Sci-Fi'}>Sci-Fi</MenuItem>
                        <MenuItem value={'Fiction'}>Fiction</MenuItem>
                        <MenuItem value={'Comedy'}>Comedy</MenuItem>
                    </Select>
                </FormControl>
                {books && books.map((value) => (
                    genre===value.genre || genre==="All"?
                    <ListItem sx={{ border: '1px solid gray', height: '4rem', padding: '.4rem' }}
                        key={value.id}
                        secondaryAction={
                            <Button onClick={() => issueBook(value.id, value.name)} sx={{ marginRight: '0.4rem' }} size='small' variant='outlined'>Issue Book</Button>
                        }
                    >
                        <p style={{marginRight:'2rem',fontSize:'1.2rem'}}>{value.name}</p>
                        <p style={{marginRight:'2rem',fontSize:'0.8rem',backgroundColor:'antiquewhite'}}>{value.genre}</p>
                    </ListItem>:<></>
                ))}
            </List>
        </Box>
    );
}
