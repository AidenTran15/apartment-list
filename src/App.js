import React, { useState } from 'react';
import ApartmentCard from './components/ApartmentCard';
import ApartmentForm from './components/ApartmentForm';
import './App.css';

const App = () => {
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const handleSave = (apartment) => {
    if (selectedApartment) {
      setApartments(apartments.map((item) => (item === selectedApartment ? apartment : item)));
    } else {
      setApartments([...apartments, apartment]);
    }
    setSelectedApartment(null);
  };

  const handleEdit = (apartment) => {
    setSelectedApartment(apartment);
  };

  return (
    <div className="App">
      <h1>Apartment Management</h1>
      <ApartmentForm apartment={selectedApartment} onSave={handleSave} />
      <div className="apartment-list">
        {apartments.map((apartment, index) => (
          <ApartmentCard key={index} apartment={apartment} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
};

export default App;
