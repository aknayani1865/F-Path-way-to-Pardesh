import {React} from 'react';
import ViewItems from './ViewItems';

const ViewTransports = () => {
  return <ViewItems itemType="Transports" apiEndpoint="https://b-path-way-to-pardesh.onrender.com/api/admin/transports" />;
};

export default ViewTransports;
