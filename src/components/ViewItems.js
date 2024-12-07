import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewItems = ({ itemType, apiEndpoint }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setItems(response.data);
      } catch (error) {
        setError('Failed to fetch items');
        console.error(error);
      }
    };

    fetchItems();
  }, [apiEndpoint]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiEndpoint}/${id}`);
      setItems(items.filter(item => item._id !== id)); // Remove deleted item from state
    } catch (error) {
      setError('Failed to delete item');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>View {itemType}</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong>
            {/* Add more fields as necessary */}
            <button onClick={() => window.location.href = `/${itemType.toLowerCase()}/edit/${item._id}`}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewItems;