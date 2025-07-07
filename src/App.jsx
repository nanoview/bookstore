import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import AddBook from './AddBook';
import './App.css';


function App() {
  
  const [books, setBooks] = useState([]);


  const columnDefs = [
    { field: 'title', sortable: true, filter: true },
    { field: 'author', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    }
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('https://bookstore-67e66-default-rtdb.europe-west1.firebasedatabase.app//books/.json')
      .then(response => response.json())
      .then(data => addKeys(data))
      .catch(err => console.error(err));
  };

  const addKeys = (data) => {
    if (!data) {
      setBooks([]);
      return;
    }
    const keys = Object.keys(data);
    const booksWithId = keys.map((key, index) => ({
      ...Object.values(data)[index],
      id: key
    }));
    setBooks(booksWithId);
  };

  const addBook = (newBook) => {
    fetch('https://bookstore-67e66-default-rtdb.europe-west1.firebasedatabase.app//books/.json', {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`https://bookstore-67e66-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`, {
      method: 'DELETE'
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>

      <AddBook addBook={addBook} />

      <div className="ag-theme-material" style={{ height: 400, width: 800, margin: 'auto', marginTop: 20 }}>
        <AgGridReact rowData={books} columnDefs={columnDefs} />
      </div>
    </>
  );
}

export default App;
