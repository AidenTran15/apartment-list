import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './AddApartmentForm.css';


const AddApartmentForm = () => {
  const [form, setForm] = useState({
    ApartmentID: '',
    Name: '',
    Images: [], // Multiple image URLs as an array
    Videos: [], // Multiple video URLs as an array
    Price: '',
    Bedrooms: '',
    Bathrooms: '',
    Furnished: false,
    Pros: [],
    Cons: [],
  });

  // Initialize navigation hook to redirect after successful submission
  const navigate = useNavigate();

  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Function to handle array fields like Images, Videos, Pros, Cons
  const handleArrayChange = (e, type) => {
    const items = e.target.value.split(',').map((item) => item.trim());
    setForm((prevForm) => ({
      ...prevForm,
      [type]: items,
    }));
  };

  // Function to handle form submission and send data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the request payload
      const payload = {
        ApartmentID: form.ApartmentID,
        Name: form.Name,
        Images: form.Images,
        Videos: form.Videos,
        Price: form.Price,
        Bedrooms: parseInt(form.Bedrooms) || 0,
        Bathrooms: parseInt(form.Bathrooms) || 0,
        Furnished: form.Furnished,
        Pros: form.Pros,
        Cons: form.Cons,
      };

      // Send POST request to the API
      const response = await fetch('https://vsw6lprnif.execute-api.ap-southeast-2.amazonaws.com/prod/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: JSON.stringify(payload) }), // Send data in the body as a string
      });

      if (response.ok) {
        alert('Apartment added successfully!');
        navigate('/'); // Redirect to the home page after successful submission
      } else {
        alert('Failed to add apartment.');
      }
    } catch (error) {
      console.error('Error adding apartment:', error);
      alert('Error adding apartment, please try again.');
    }
  };

  return (
    <div className="add-apartment-form">
      <h2>Add New Apartment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Apartment ID:
          <input type="text" name="ApartmentID" value={form.ApartmentID} onChange={handleChange} required />
        </label>
        <label>
          Name:
          <input type="text" name="Name" value={form.Name} onChange={handleChange} required />
        </label>
        <label>
          Image URLs (comma separated):
          <input type="text" value={form.Images.join(', ')} onChange={(e) => handleArrayChange(e, 'Images')} />
        </label>
        <label>
          Video URLs (comma separated):
          <input type="text" value={form.Videos.join(', ')} onChange={(e) => handleArrayChange(e, 'Videos')} />
        </label>
        <label>
          Price:
          <input type="text" name="Price" value={form.Price} onChange={handleChange} />
        </label>
        <label>
          Bedrooms:
          <input type="number" name="Bedrooms" value={form.Bedrooms} onChange={handleChange} />
        </label>
        <label>
          Bathrooms:
          <input type="number" name="Bathrooms" value={form.Bathrooms} onChange={handleChange} />
        </label>
        <label>
          Furnished:
          <input
            type="checkbox"
            name="Furnished"
            checked={form.Furnished}
            onChange={() => setForm((prevForm) => ({ ...prevForm, Furnished: !prevForm.Furnished }))}
          />
        </label>
        <label>
          Pros (comma separated):
          <input type="text" value={form.Pros.join(', ')} onChange={(e) => handleArrayChange(e, 'Pros')} />
        </label>
        <label>
          Cons (comma separated):
          <input type="text" value={form.Cons.join(', ')} onChange={(e) => handleArrayChange(e, 'Cons')} />
        </label>
        <button type="submit">Add Apartment</button>
      </form>
    </div>
  );
};

export default AddApartmentForm;
