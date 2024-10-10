import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddApartmentForm.css';

const AddApartmentForm = () => {
  const [form, setForm] = useState({
    ApartmentID: '',
    Name: '',
    Images: [],
    Videos: [],
    Price: '',
    Bedrooms: '',
    Bathrooms: '',
    Furnished: false,
    Pros: [],
    Cons: [],
    URL: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

// Function to handle array fields like Images, Videos, Pros, Cons

const handleArrayChange = (e, type) => {
  // Directly split the input by commas without trimming
  const items = e.target.value.split(',');

  setForm((prevForm) => ({
    ...prevForm,
    [type]: items,
  }));
};


  const formatImageUrls = (imageSegments) => {
    const completeUrls = [];
    let currentUrl = '';

    imageSegments.forEach((segment) => {
      if (segment.startsWith('https://')) {
        if (currentUrl) {
          completeUrls.push(currentUrl);
        }
        currentUrl = segment;
      } else {
        currentUrl += `,${segment}`;
      }
    });

    if (currentUrl) {
      completeUrls.push(currentUrl);
    }

    return completeUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedImages = form.Images.filter((url) => url.includes('https://'));

      const payload = {
        ApartmentID: form.ApartmentID,
        Name: form.Name,
        Images: cleanedImages,
        Videos: form.Videos,
        Price: form.Price,
        Bedrooms: parseInt(form.Bedrooms) || 0,
        Bathrooms: parseInt(form.Bathrooms) || 0,
        Furnished: form.Furnished,
        Pros: form.Pros,
        Cons: form.Cons,
        URL: form.URL,
      };

      const response = await fetch('https://vsw6lprnif.execute-api.ap-southeast-2.amazonaws.com/prod/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: JSON.stringify(payload) }),
      });

      if (response.ok) {
        alert('Apartment added successfully!');
        navigate('/');
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
        <label className="section-title">Media Information</label>
        <label>
          Image URLs (comma separated):
          <input type="text" value={form.Images.join(', ')} onChange={(e) => handleArrayChange(e, 'Images')} placeholder="https://image1, https://image2" />
        </label>
        <label>
          Video URLs (comma separated):
          <input type="text" value={form.Videos.join(', ')} onChange={(e) => handleArrayChange(e, 'Videos')} placeholder="https://video1, https://video2" />
        </label>
        <label className="section-title">Property Details</label>
        <label>
          Price:
          <input type="text" name="Price" value={form.Price} onChange={handleChange} placeholder="$1200/month" />
        </label>
        <label>
          Bedrooms:
          <input type="number" name="Bedrooms" value={form.Bedrooms} onChange={handleChange} placeholder="2" />
        </label>
        <label>
          Bathrooms:
          <input type="number" name="Bathrooms" value={form.Bathrooms} onChange={handleChange} placeholder="1" />
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
        <label className="section-title">Pros and Cons</label>
        <label>
          Pros (comma separated):
          <input type="text" value={form.Pros.join(', ')} onChange={(e) => handleArrayChange(e, 'Pros')} placeholder="Spacious, Near park" />
        </label>
        <label>
          Cons (comma separated):
          <input type="text" value={form.Cons.join(', ')} onChange={(e) => handleArrayChange(e, 'Cons')} placeholder="Noisy, Expensive" />
        </label>
        <label>
          URL:
          <input type="text" name="URL" value={form.URL} onChange={handleChange} placeholder="Enter property URL" />
        </label>
        <button type="submit">Add Apartment</button>
      </form>
    </div>
  );
};

export default AddApartmentForm;
