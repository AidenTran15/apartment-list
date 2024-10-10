import React, { useEffect, useState } from 'react';
import './ApartmentList.css'; // Import the CSS file for styling

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Store index of current image for each apartment

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
          // Initialize currentImageIndex state for each apartment
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

  // Function to handle next image
  const handleNextImage = (index) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [index]: (prev[index] + 1) % apartments[index].Images.length,
    }));
  };

  // Function to handle previous image
  const handlePreviousImage = (index) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [index]: (prev[index] - 1 + apartments[index].Images.length) % apartments[index].Images.length,
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
        <table className="apartment-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Apartment ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Furnished</th>
              <th>Images</th>
              <th>Videos</th>
              <th>Pros</th>
              <th>Cons</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apartment, index) => (
              <tr key={index}>
                <td>{apartment.ApartmentID}</td>
                <td>{apartment.Name}</td>
                <td>{apartment.Price}</td>
                <td>{apartment.Bedrooms}</td>
                <td>{apartment.Bathrooms}</td>
                <td>{apartment.Furnished ? 'Yes' : 'No'}</td>
                <td className="image-cell">
                  {apartment.Images && apartment.Images.length > 0 ? (
                    <div className="carousel-container">
                      {/* Display the current image */}
                      <img
                        src={apartment.Images[currentImageIndex[index]]}
                        alt={`Apartment Image ${currentImageIndex[index] + 1}`}
                        className="apartment-image"
                      />
                      {/* Navigation buttons */}
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
                  {apartment.Videos && apartment.Videos.length > 0
                    ? apartment.Videos.map((video, vidIndex) => (
                        <video
                          key={vidIndex}
                          src={video}
                          controls
                          style={{ width: '100px', height: '100px', margin: '5px' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ))
                    : 'No Videos'}
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
                <td>
                  {apartment.URL ? (
                    <a href={apartment.URL} target="_blank" rel="noopener noreferrer">
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
      )}
    </div>
  );
};

export default ApartmentList;