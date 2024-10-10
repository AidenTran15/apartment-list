import React, { useState } from 'react';

const ApartmentForm = ({ apartment, onSave }) => {
  const [form, setForm] = useState(apartment || {
    ApartmentID: '',
    Name: '',
    Images: [], // Multiple image URLs as an array
    Videos: [], // Multiple video URLs as an array
    Price: '',  // Price as a string
    Bedrooms: '',
    Bathrooms: '',
    Furnished: false,
    Pros: [],
    Cons: [],
  });

  // API URL to add data to DynamoDB via Lambda function
  const API_URL = 'https://vsw6lprnif.execute-api.ap-southeast-2.amazonaws.com/prod/add';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, type) => {
    const items = e.target.value.split(',').map((item) => item.trim());
    setForm((prevForm) => ({
      ...prevForm,
      [type]: items,
    }));
  };

  const handleSubmit = async () => {
    // Create the request body based on the form state
    const requestBody = {
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

    try {
      // Send POST request to the API URL
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: JSON.stringify(requestBody) }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success: ${data}`);
        onSave(form);
      } else {
        alert(`Failed to add apartment: ${data}`);
      }
    } catch (error) {
      console.error('Error adding apartment:', error);
      alert('Error adding apartment, please try again.');
    }
  };

  return (
    <div className="apartment-form">
      <h2>{apartment ? 'Edit Apartment' : 'Add New Apartment'}</h2>
      <label>
        Apartment ID:
        <input type="text" name="ApartmentID" value={form.ApartmentID} onChange={handleChange} />
      </label>
      <label>
        Name:
        <input type="text" name="Name" value={form.Name} onChange={handleChange} />
      </label>
      <label>
        Image URLs (comma separated):
        <input
          type="text"
          value={form.Images.join(', ')}
          onChange={(e) => handleArrayChange(e, 'Images')}
        />
      </label>
      <label>
        Video URLs (comma separated):
        <input
          type="text"
          value={form.Videos.join(', ')}
          onChange={(e) => handleArrayChange(e, 'Videos')}
        />
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
        <input
          type="text"
          value={form.Pros.join(', ')}
          onChange={(e) => handleArrayChange(e, 'Pros')}
        />
      </label>
      <label>
        Cons (comma separated):
        <input
          type="text"
          value={form.Cons.join(', ')}
          onChange={(e) => handleArrayChange(e, 'Cons')}
        />
      </label>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default ApartmentForm;
