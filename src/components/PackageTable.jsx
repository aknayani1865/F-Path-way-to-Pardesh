import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DescriptionModal from "./DescriptionModal"; // Import the modal
import LoadingSpinner from './LoadingSpinner';

const PackageTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [packages, setPackages] = useState([]);
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [transports, setTransports] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const today = new Date();
  const [pdfUrl, setPdfUrl] = useState('');
  const [newPdf, setNewPdf] = useState(null);
  const minStartDate = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
  const [editFormData, setEditFormData] = useState({
    name: '',
    sourceId: '',
    destinationId: '',
    hotelId: '',
    transportId: '',
    startDate: '',
    endDate: '',
    basePrice: '',
    totalDistance: '',
    description: '',
    newImages: [],
    imagesToRemove: [],
    existingImages: []
  });
  const navigate = useNavigate();
  
  const navigateTo = (path) => {
    navigate(path);
  };


  useEffect(() => {
    fetchPackages();
    fetchSources();
    fetchDestinations();
    fetchHotels();
    fetchTransports();
  }, []);


  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/packages', config);
      setIsLoading(false);
      setPackages(response.data);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setSources(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setIsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setIsLoading(false);
      setDestinations(response.data);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setIsLoading(false);
    }
  };


  const openModal = (description) => {
    setModalDescription(description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalDescription("");
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', config);
      setHotels(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setIsLoading(false);
    }
  };

  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transports', config);
      setTransports(response.data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/packages/${id}`, config);
        fetchPackages(); // Refresh the package list
        setIsLoading(
          
        );
        toast.success('Package deleted successfully!'); // Success toast
      } catch (error) {
        console.error('Error deleting package:', error);
        setIsLoading(false);
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    }
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const loadingToast = toast.loading('Editing package...');

    const updatedPackageData = { ...editFormData };

    // Convert new images to base64
    const newImagesBase64 = await Promise.all(
      updatedPackageData.newImages.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
        });
      })
    );
    updatedPackageData.newImages = newImagesBase64;

    // Convert new PDF to base64
    let newPdfBase64 = null;
    if (newPdf) {
      newPdfBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(newPdf);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    }

    if (newPdfBase64) {
      updatedPackageData.pdf = newPdfBase64;
    }
    try {
      await axios.put(`http://localhost:5000/api/admin/packages/${editId}`, updatedPackageData, config);
      setEditId(null); // Exit edit mode
      fetchPackages(); // Refresh the package list
      setIsLoading(false);
      toast.success('Package updated successfully!'); // Success toast
    } catch (error) {
      console.error('Error updating package:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Error updating package. Please try again.');
      setIsLoading(false);
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    } finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };


  const handleEditClick = (pkg) => {
    setEditId(pkg._id);
    setEditFormData({
      name: pkg.name || 'Unknown',
      sourceId: pkg.source?._id || 'Unknown',
      destinationId: pkg.destination?._id || 'Unknown',
      hotelId: pkg.hotel?._id || 'Unknown',
      transportId: pkg.transports?._id || 'Unknown',
      startDate: pkg.startDate ? pkg.startDate.slice(0, 10) : 'Unknown',
      endDate: pkg.endDate ? pkg.endDate.slice(0, 10) : 'Unknown',
      basePrice: pkg.basePrice || 'Unknown',
      totalDistance: pkg.totalDistance || 'Unknown',
      description: pkg.description || 'Unknown',
      newImages: [],
      imagesToRemove: [],
      existingImages: pkg.images || []
    });
    setPdfUrl(pkg.pdf?.url || ''); // Set the PDF URL
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageRemove = (publicId) => {
    setEditFormData({
      ...editFormData,
      imagesToRemove: [...editFormData.imagesToRemove, publicId],
      existingImages: editFormData.existingImages.filter(img => img.public_id !== publicId)
    });
  };

  const handleNewImageChange = (e) => {
    setEditFormData({ ...editFormData, newImages: [...editFormData.newImages, ...e.target.files] });
  };

  const handleNewPdfChange = (e) => {
    setNewPdf(e.target.files[0]);
  };
  return (
    <>
      <NavbarAdmin />
     {
      isLoading ? (
        <div><LoadingSpinner/></div>
      ):(
        <>
         <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        description={modalDescription}
      />
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <button style={styles.addButton} onClick={() => navigateTo('/addpackage')}>Add Package</button>
        </div>
        <h1 style={styles.header}>Package Table</h1>
        {editId ? (
          <form onSubmit={handleEditFormSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              placeholder="Package Name"
              required
              style={styles.input}
            />
            <select name="sourceId" value={editFormData.sourceId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source._id} value={source._id}>
                  {source.name || 'Unknown'}
                </option>
              ))}
            </select>
            <select name="destinationId" value={editFormData.destinationId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Destination</option>
              {destinations.map((destination) => (
                <option key={destination._id} value={destination._id}>
                  {destination.name || 'Unknown'}
                </option>
              ))}
            </select>
            <select name="hotelId" value={editFormData.hotelId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name || 'Unknown'} - {hotel.place?.name || 'Unknown'}
                </option>
              ))}
            </select>
            <select name="transportId" value={editFormData.transportId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Transport</option>
              {transports.map((transport) => (
                <option key={transport._id} value={transport._id}>
                  {transport.type || 'Unknown'} ({transport.from?.name || 'Unknown'} - {transport.to?.name || 'Unknown' })
                </option>
              ))}
            </select>
            <input
              type="date"
              name="startDate"
              value={editFormData.startDate}
              onChange={handleEditFormChange}
              min={minStartDate}
              required
              style={styles.input}
            />
            <input
              type="date"
              name="endDate"
              value={editFormData.endDate}
              onChange={handleEditFormChange}
              min={minStartDate}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="basePrice"
              value={editFormData.basePrice}
              onChange={handleEditFormChange}
              placeholder="Base Price"
              required
              style={styles.input}
            />
            <input
              type="number"
              name="totalDistance"
              value={editFormData.totalDistance}
              onChange={handleEditFormChange}
              placeholder="Total Distance"
              required
              style={styles.input}
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              placeholder="Description"
              rows="4"
              style={styles.textarea}
            />
            <div>
              {editFormData.existingImages.map((img, index) => (
                <div key={index} style={styles.imageContainer}>
                  <img src={img.url} alt={`Package Image ${index + 1}`} style={styles.image} />
                  <button type="button" onClick={() => handleImageRemove(img.public_id)} style={styles.removeButton}>Remove</button>
                </div>
              ))}
            </div>
            <div style={styles.inlineContainer}>
            <label htmlFor="newImages" style={styles.inlineLabel}>Upload Images</label>
            <input
              type="file"
              name="newImages"
              multiple
              onChange={handleNewImageChange}
              style={styles.fileInput}
            />
            </div>
            {pdfUrl && (
              <div>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={styles.viewButton}>
                  View PDF
                </a>
              </div>
            )}
            <div style={styles.inlineContainer}>
              <label htmlFor="newPdf" style={styles.inlineLabel}>Upload PDF</label>
              <input
                type="file"
                id="newPdf"
                name="newPdf"
                accept="application/pdf"
                onChange={handleNewPdfChange}
                style={styles.inlineFileInput}
              />
            </div>
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditId(null)} style={styles.cancelButton}>Cancel</button>
            {error && <div style={styles.error}>{error}</div>}
          </form>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Hotel</th>
                <th>Transport</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Base Price</th>
                <th>Total Distance</th>
                <th>Description</th>
                <th>Image</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.name || 'Unknown'}</td>
                  <td>{pkg.source?.name || 'Unknown'}</td>
                  <td>{pkg.destination?.name || 'Unknown'}</td>
                  <td>{pkg.hotel?.name || 'Unknown'}</td>
                  <td>{pkg.transports?.type || 'Unknown'}</td>
                  <td>{pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : 'Unknown'}</td>
                  <td>{pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : 'Unknown'}</td>
                  <td>{pkg.basePrice || 'Unknown'}</td>
                  <td>{pkg.totalDistance || 'Unknown'}</td>
                 <td>
                    {pkg.description ? (
                      <button onClick={() => openModal(pkg.description)} style={styles.viewButton}>
                        View Description
                      </button>
                    ) : (
                      'No Description'
                    )}
                 </td>
                  <td>
                    {pkg.images && pkg.images.length > 0 ? (
                      pkg.images.map((img, index) => (
                        <a
                          key={index}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'block', marginBottom: '5px' }}
                        >
                          View Image {index + 1}
                        </a>
                      ))
                    ) : (
                      'No Images'
                    )}
                  </td>
                  <td>
                    {pkg.pdf ? (
                      <a
                        href={pkg.pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.viewButton}
                      >
                        View PDF
                      </a>
                    ) : (
                      'No PDF'
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(pkg)} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(pkg._id)} style={styles.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
        </>
      )
     }
    </>
  );
};


const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '92vh'
  },
  inlineContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Adjust the gap as needed
  },
  inlineLabel: {
    fontSize: '16px',
    color: '#333',
  },
  inlineFileInput: {
    border: 'none',
    padding: '10px',
    fontSize: '16px',
  },
  buttonContainer: {
    marginBottom: '20px'
  },
  addButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  fileInput: {
    border: 'none',
    padding: '10px',
    fontSize: '16px'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: '#dc3545',
    marginTop: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  tableHeader: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px'
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd'
  },
  viewButton: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  editButton: {
    backgroundColor: '#ffc107',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  image: {
    width: '100px',
    height: 'auto',
    marginRight: '10px'
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};


export default PackageTable;
