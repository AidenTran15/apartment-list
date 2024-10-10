import React, { useEffect, useState } from 'react';
import './ApartmentCard.css'; // Import the CSS file for styling

const ApartmentCard = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState({}); // Track current image index for each apartment

  const API_URL = 'https://tm54z87qrk.execute-api.ap-southeast-2.amazonaws.com/prod/get';

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }
        const data = await response.json();

        let apartmentsData;
        if (data && typeof data.body === 'string') {
          apartmentsData = JSON.parse(data.body); // Parse the body string
        }

        if (Array.isArray(apartmentsData)) {
          setApartments(apartmentsData);
          // Initialize current index tracking for each apartment
          const initialIndexes = {};
          apartmentsData.forEach((_, index) => {
            initialIndexes[index] = 0;
          });
          setCurrentIndex(initialIndexes);
        } else {
          setError('Invalid data format received from the server');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Function to handle next image click for each apartment
  const nextImage = (index) => {
    setCurrentIndex((prevIndexes) => ({
      ...prevIndexes,
      [index]: (prevIndexes[index] + 1) % apartments[index].Images.length
    }));
  };

  // Function to handle previous image click for each apartment
  const prevImage = (index) => {
    setCurrentIndex((prevIndexes) => ({
      ...prevIndexes,
      [index]:
        prevIndexes[index] === 0 ? apartments[index].Images.length - 1 : prevIndexes[index] - 1
    }));
  };

  if (loading) return <p>Loading apartments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="apartment-list">
      <h1>Apartment Listings</h1>
      {apartments.length === 0 ? (
        <p>No apartments available.</p>
      ) : (
        <div className="card-container"> {/* Container for card layout */}
          {apartments.map((apartment, index) => (
            <div className="apartment-card" key={index}>
              <div className="card-image-container">
                <button
                  className="arrow-button arrow-left"
                  onClick={() => prevImage(index)}
                >
                  &#8249;
                </button>
                <img
                  src={apartment.Images[currentIndex[index]]}
                  alt={`Apartment Image ${currentIndex[index] + 1}`}
                  className="apartment-image"
                />
                <button
                  className="arrow-button arrow-right"
                  onClick={() => nextImage(index)}
                >
                  &#8250;
                </button>
              </div>
              <div className="card-content">
                <h2>{apartment.Name}</h2>
                <p><strong>Price:</strong> {apartment.Price}</p>
                <p><strong>Bedrooms:</strong> {apartment.Bedrooms}</p>
                <p><strong>Bathrooms:</strong> {apartment.Bathrooms}</p>
                <p><strong>Furnished:</strong> {apartment.Furnished ? 'Yes' : 'No'}</p>
                <div className="pros-cons">
                  <div>
                    <strong>Pros:</strong>
                    <ul>
                      {apartment.Pros.map((pro, proIndex) => (
                        <li key={proIndex}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Cons:</strong>
                    <ul>
                      {apartment.Cons.map((con, conIndex) => (
                        <li key={conIndex}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {apartment.URL && (
                  <a href={apartment.URL} target="_blank" rel="noopener noreferrer">
                    View Property
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApartmentCard;
