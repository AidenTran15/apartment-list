import React, { useEffect, useState } from 'react';
import './ApartmentList.css'; // Import the CSS file for styling

// Modal component to display apartment details
const ApartmentModal = ({ apartment, isOpen, onClose }) => {
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);

  // Reset the image index when the modal is opened with a new apartment
  useEffect(() => {
    if (apartment) {
      setCurrentModalImageIndex(0);
    }
  }, [apartment]);

  // Handle next image in the modal
  const handleNextModalImage = () => {
    if (apartment && apartment.Images) {
      setCurrentModalImageIndex((prevIndex) => (prevIndex + 1) % apartment.Images.length);
    }
  };

  // Handle previous image in the modal
  const handlePreviousModalImage = () => {
    if (apartment && apartment.Images) {
      setCurrentModalImageIndex((prevIndex) =>
        (prevIndex - 1 + apartment.Images.length) % apartment.Images.length
      );
    }
  };

  if (!isOpen || !apartment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        {/* Modal Image Carousel */}
        <div className="modal-carousel">
          <button className="carousel-button left-button" onClick={handlePreviousModalImage}>
            &#8249;
          </button>
          <img
            src={apartment.Images[currentModalImageIndex]}
            alt={`Apartment Image ${currentModalImageIndex + 1}`}
            className="modal-image"
          />
          <button className="carousel-button right-button" onClick={handleNextModalImage}>
            &#8250;
          </button>
        </div>
        {/* Apartment Details */}
        <h2>{apartment.Name}</h2>
        <p><strong>Price:</strong> {apartment.Price}</p>
        <p><strong>Bedrooms:</strong> {apartment.Bedrooms}</p>
        <p><strong>Bathrooms:</strong> {apartment.Bathrooms}</p>
        <p><strong>Furnished:</strong> {apartment.Furnished ? 'Yes' : 'No'}</p>
        <div>
          <strong>Pros:</strong>
          <ul>
            {apartment.Pros.map((pro, index) => <li key={index}>{pro}</li>)}
          </ul>
        </div>
        <div>
          <strong>Cons:</strong>
          <ul>
            {apartment.Cons.map((con, index) => <li key={index}>{con}</li>)}
          </ul>
        </div>
        <a href={apartment.URL} target="_blank" rel="noopener noreferrer">View Property</a>
      </div>
    </div>
  );
};

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedApartment, setSelectedApartment] = useState(null); // State to manage selected apartment
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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

  // Function to handle modal open
  const handleImageClick = (apartment) => {
    setSelectedApartment(apartment);
    setIsModalOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApartment(null);
  };

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
                      <img
                        src={apartment.Images[currentImageIndex[index]]}
                        alt={`Apartment Image ${currentImageIndex[index] + 1}`}
                        className="apartment-image"
                        onClick={() => handleImageClick(apartment)}
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
      {/* Apartment Modal */}
      <ApartmentModal apartment={selectedApartment} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ApartmentList;
