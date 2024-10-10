import React from 'react';

const ApartmentCard = ({ apartment, onEdit }) => {
  return (
    <div className="apartment-card">
      <h2>{apartment.name}</h2>

      {/* Display all images */}
      {apartment.images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Apartment Image ${index + 1}`}
          style={{ width: '100%', height: '200px', margin: '10px 0' }}
        />
      ))}

      {/* Display all videos */}
      {apartment.videos.map((video, index) => (
        <video key={index} src={video} controls style={{ width: '100%', margin: '10px 0' }}>
          Your browser does not support the video tag.
        </video>
      ))}

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
