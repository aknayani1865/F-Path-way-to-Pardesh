import React from 'react';
import ViewItems from './ViewItems';

const ViewDestinations = () => {
  return <ViewItems itemType="Destinations" apiEndpoint="http://localhost:5000/api/admin/destinations" />;
};

export default ViewDestinations;