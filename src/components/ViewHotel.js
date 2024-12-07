import React from 'react';
import ViewItems from './ViewItems';

const ViewHotels = () => {
  return <ViewItems itemType="Hotels" apiEndpoint="http://localhost:5000/api/admin/hotels" />;
};

export default ViewHotels;