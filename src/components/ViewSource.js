import React from 'react';
import ViewItems from './ViewItems';

const ViewSources = () => {
  return <ViewItems itemType="Sources" apiEndpoint="http://localhost:5000/api/admin/sources" />;
};

export default ViewSources;