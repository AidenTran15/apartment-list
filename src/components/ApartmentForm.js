import React, { useState } from 'react';

const ApartmentForm = ({ apartment, onSave }) => {
  const [form, setForm] = useState(apartment || {
    name: '',
    images: [], // Multiple image URLs as an array
    videos: [], // Multiple video URLs as an array
    price: '', // Price as a string input
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    pros: [],
    cons: [],
  });

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

  return (
    <div className="apartment-form">
      <h2>{apartment ? 'Edit Apartment' : 'Add New Apartment'}</h2>
      <label>
        Name:
        <input type="text" name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>
        Image URLs (comma separated):
        <input
          type="text"
          value={form.images.join(', ')}
          onChange={(e) => handleArrayChange(e, 'images')}
        />
      </label>
      <label>
        Video URLs (comma separated):
        <input
          type="text"
          value={form.videos.join(', ')}
          onChange={(e) => handleArrayChange(e, 'videos')}
        />
      </label>
      <label>
        Price:
        <input type="text" name="price" value={form.price} onChange={handleChange} />
      </label>
      <label>
        Bedrooms:
        <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
      </label>
      <label>
        Bathrooms:
        <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
      </label>
      <label>
        Furnished:
        <input
          type="checkbox"
          name="furnished"
          checked={form.furnished}
          onChange={() => setForm((prevForm) => ({ ...prevForm, furnished: !prevForm.furnished }))}
        />
      </label>
      <label>
        Pros (comma separated):
        <input
          type="text"
          value={form.pros.join(', ')}
          onChange={(e) => handleArrayChange(e, 'pros')}
        />
      </label>
      <label>
        Cons (comma separated):
        <input
          type="text"
          value={form.cons.join(', ')}
          onChange={(e) => handleArrayChange(e, 'cons')}
        />
      </label>
      <button onClick={() => onSave(form)}>Save</button>
    </div>
  );
};

export default ApartmentForm;
