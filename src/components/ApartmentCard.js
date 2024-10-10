import React from 'react';

const ApartmentCard = ({ apartment, onEdit }) => {
  return (
    <div className="apartment-card">
      <img src={apartment.image} alt="Apartment" style={{ width: '100%', height: '200px' }} />
      <h2>{apartment.name}</h2>
      <p>Price: ${apartment.price}</p>
      <p>Conveniences: {apartment.conveniences}</p>
      <p>Bedrooms: {apartment.bedrooms}</p>
      <p>Bathrooms: {apartment.bathrooms}</p>
      <p>Furnished: {apartment.furnished ? 'Yes' : 'No'}</p>
      <h4>Pros:</h4>
      <ul>
        {apartment.pros.map((pro, index) => (
          <li key={index}>{pro}</li>
        ))}
      </ul>
      <h4>Cons:</h4>
      <ul>
        {apartment.cons.map((con, index) => (
          <li key={index}>{con}</li>
        ))}
      </ul>
      <button onClick={() => onEdit(apartment)}>Edit</button>
    </div>
  );
};

export default ApartmentCard;
