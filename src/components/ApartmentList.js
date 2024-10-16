import React, { useEffect, useState } from 'react';
import './ApartmentList.css'; // Import the CSS file for styling

// Modal component to display apartment details
const ApartmentModal = ({ apartment, isOpen, onClose }) => {
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);

  useEffect(() => {
    if (apartment) {
      setCurrentModalImageIndex(0);
    }
  }, [apartment]);

  const handleNextModalImage = () => {
    if (apartment && apartment.Images) {
      setCurrentModalImageIndex((prevIndex) => (prevIndex + 1) % apartment.Images.length);
    }
  };

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
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">{apartment.Name}</h2>
          <p className="modal-subtitle">{apartment.ApartmentID || 'Unknown ID'}</p>
        </div>

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

        {/* Price and Details Section */}
        <div className="modal-info-container">
          <div className="modal-info-card">
            <h3 className="modal-section-title">Price</h3>
            <p className="modal-price">{apartment.Price}</p>
          </div>
          <div className="modal-info-card">
            <h3 className="modal-section-title">Details</h3>
            <div className="modal-details-grid">
              <div className="modal-details-item">
                <span>{apartment.Bedrooms} Bedrooms</span>
              </div>
              <div className="modal-details-item">
                <span>{apartment.Bathrooms} Bathrooms</span>
              </div>
              <div className="modal-details-item">
                <span>{apartment.Furnished ? 'Furnished' : 'Not Furnished'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons Section */}
        <div className="pros-cons-container">
          <div className="pros-cons pros">
            <h3 className="modal-section-title">Pros</h3>
            <ul>
              {apartment.Pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className="pros-cons cons">
            <h3 className="modal-section-title">Bond</h3>
            <ul>
              {apartment.Cons.map((con, index) => (
                <li className="con" key={index}>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* View Property Link */}
        {apartment.URL && (
          <a
            href={apartment.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="property-link"
          >
            View Property
          </a>
        )}
      </div>
    </div>
  );
};

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null); // State to manage selected apartment
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [priceSortOption, setPriceSortOption] = useState(0); // State for managing sorting option for price
  const [nameFilter, setNameFilter] = useState('All'); // State for managing filter by name
  const [bathroomFilter, setBathroomFilter] = useState('All'); // New state for bathroom filter

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

  const extractPrice = (priceString) => {
    const match = priceString.match(/\$([0-9,]+)/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
  };

  const handlePriceSortChange = (e) => {
    setPriceSortOption(Number(e.target.value)); // Convert value to number
  };

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value); // Set the selected name filter
  };

  const handleBathroomFilterChange = (e) => {
    setBathroomFilter(e.target.value); // Set the selected bathroom filter
  };

  const handleImageClick = (apartment) => {
    setSelectedApartment(apartment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApartment(null);
  };

  // Get unique apartment names for the dropdown options
  const uniqueApartmentNames = ['All', ...new Set(apartments.map((apartment) => apartment.Name))];

  // Filter apartments based on selected filters
  const filteredApartments = apartments
    .filter((apartment) => nameFilter === 'All' || apartment.Name === nameFilter)
    .filter(
      (apartment) =>
        bathroomFilter === 'All' || apartment.Bathrooms === Number(bathroomFilter)
    );

  // Sort apartments based on selected price sort option
  const sortedApartments = filteredApartments.sort((a, b) => {
    if (priceSortOption === 1) {
      return extractPrice(a.Price) - extractPrice(b.Price);
    } else if (priceSortOption === 2) {
      return extractPrice(b.Price) - extractPrice(a.Price);
    }
    return 0; // Default sorting
  });

  if (loading) return <p>Loading apartments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="apartment-list">
      {/* Container to position header and filters together */}
      <div className="header-filter-container">
        <h1>Apartment Listings for Kilầy & Ribu</h1>

        {/* Container to keep filters in the same row */}
        <div className="filter-row">
          {/* Filtering Dropdown for Bathrooms */}
          <div className="filter-container">
            <label htmlFor="bathroomFilter">Filter by Bathrooms:</label>
            <select
              id="bathroomFilter"
              value={bathroomFilter}
              onChange={handleBathroomFilterChange}
              className="filter-dropdown"
            >
              <option value="All">All</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              {/* Add more options if needed */}
            </select>
          </div>

          {/* Sorting Dropdown for Price */}
          <div className="sorting-container">
            <label htmlFor="priceSort">Sort by Price:</label>
            <select
              id="priceSort"
              value={priceSortOption}
              onChange={handlePriceSortChange}
              className="sorting-dropdown"
            >
              <option value="0">Default</option>
              <option value="1">Low to High</option>
              <option value="2">High to Low</option>
            </select>
          </div>

          {/* Filtering Dropdown for Apartment Name */}
          <div className="filter-container">
            <label htmlFor="nameFilter">Filter by Name:</label>
            <select
              id="nameFilter"
              value={nameFilter}
              onChange={handleNameFilterChange}
              className="filter-dropdown"
            >
              {uniqueApartmentNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {sortedApartments.length === 0 ? (
        <p>No apartments available.</p>
      ) : (
        <table className="apartment-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Name</th>
              <th>Price</th>
              <th>Bed</th>
              <th>Bath</th>
              <th>Furnished</th>
              <th>Images</th>
              <th>Pros</th>
              <th>Bond</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {sortedApartments.map((apartment, index) => (
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
                        src={apartment.Images[0]}
                        alt={`Apartment Image`}
                        className="apartment-image"
                        onClick={() => handleImageClick(apartment)}
                      />
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
      {selectedApartment && (
        <ApartmentModal
          apartment={selectedApartment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ApartmentList;
