import React, { useEffect, useState } from 'react';
import './ApartmentList.css'; // Updated CSS file for enhanced styling

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

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
          apartmentsData = JSON.parse(data.body);
        }

        if (Array.isArray(apartmentsData)) {
          setApartments(apartmentsData);
          const initialImageIndexes = {};
          apartmentsData.forEach((_, index) => {
            initialImageIndexes[index] = 0;
          });
          setCurrentImageIndex(initialImageIndexes);
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

  const handleNextImage = (index) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [index]: (prev[index] + 1) % apartments[index].Images.length,
    }));
  };

  const handlePreviousImage = (index) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [index]: (prev[index] - 1 + apartments[index].Images.length) % apartments[index].Images.length,
    }));
  };

  if (loading) return <p>Loading apartments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="apartment-list-container">
      <h1 className="apartment-list-title">Available Apartments</h1>
      {apartments.length === 0 ? (
        <p>No apartments available.</p>
      ) : (
        <div className="table-wrapper">
          <table className="apartment-table">
            <thead>
              <tr>
                <th>Apartment ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Bed</th>
                <th>Bath</th>
                <th>Furnished</th>
                <th>Images</th>
                <th>Pros</th>
                <th>Cons</th>
                <th>Bond</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((apartment, index) => (
                <tr key={index} className="apartment-row">
                  <td>{apartment.ApartmentID}</td>
                  <td>{apartment.Name}</td>
                  <td>{apartment.Price}</td>
                  <td>{apartment.Bedrooms}</td>
                  <td>{apartment.Bathrooms}</td>
                  <td>{apartment.Furnished ? 'Yes' : 'No'}</td>
                  <td className="image-cell">
                    {apartment.Images && apartment.Images.length > 0 ? (
                      <div className="carousel-container">
                        <img
                          src={apartment.Images[currentImageIndex[index]]}
                          alt={`Apartment Image ${currentImageIndex[index] + 1}`}
                          className="apartment-image"
                        />
                        <button onClick={() => handlePreviousImage(index)} className="carousel-button left-button">
                          &#8249;
                        </button>
                        <button onClick={() => handleNextImage(index)} className="carousel-button right-button">
                          &#8250;
                        </button>
                      </div>
                    ) : (
                      'No Images'
                    )}
                  </td>
                  <td>
                    <ul>
                      {apartment.Pros.map((pro, proIndex) => (
                        <li key={proIndex}>{pro}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {apartment.Cons.map((con, conIndex) => (
                        <li key={conIndex}>{con}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{apartment.Bond}</td>
                  <td>
                    {apartment.URL ? (
                      <a href={apartment.URL} target="_blank" rel="noopener noreferrer" className="apartment-link">
                        View Property
                      </a>
                    ) : (
                      'No URL'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApartmentList;
