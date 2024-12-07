import {React} from 'react';
import ViewItems from './ViewItems';

const ViewTransports = () => {
  return <ViewItems itemType="Transports" apiEndpoint="http://localhost:5000/api/admin/transports" />;
};

export default ViewTransports;