import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ApartmentList from './components/ApartmentList';
import AddApartmentForm from './components/AddApartmentForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link> | <Link to="/add-apartment">Add New Apartment</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ApartmentList />} />
          <Route path="/add-apartment" element={<AddApartmentForm onAddApartment={handleAddApartment} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Function to handle adding a new apartment (replace with API call if needed)
const handleAddApartment = (newApartment) => {
  // This function can be used to send a POST request to the server
  console.log('New Apartment Data:', newApartment);
  // You can make a POST request here to your API endpoint to add the apartment to the database
};

export default App;
