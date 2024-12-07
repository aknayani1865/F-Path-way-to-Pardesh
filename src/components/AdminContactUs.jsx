import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TextField, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const AdminContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [Sloading , setSloading] = useState(true);
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        };
        const response = await axios.get('https://b-path-way-to-pardesh.onrender.com/api/admin/contact', config);
        setContacts(response.data);
        setSloading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setSloading(false);
        toast.error(error.response ? error.response.data.message : 'Error fetching contacts. Please try again.');
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      };
      await axios.delete(`https://b-path-way-to-pardesh.onrender.com/api/admin/contact/${id}`, config);
      setContacts(contacts.filter(contact => contact._id !== id));
      toast.success('Contact message deleted successfully');
      setSloading(false);
    } catch (error) {
      console.error('Error deleting contact message:', error);
      setSloading(false);
      toast.error(error.response ? error.response.data.message : 'Error deleting contact message. Please try again.');
    }
  };

  const handleOpen = (description) => {
    setSelectedDescription(description);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDescription('');
  };

  const handleReplyOpen = (contact) => {
    if (contact.status === 'completed') {
      if (!window.confirm('One time email is sent. Do you want to send the email a second time?')) {
        return;
      }
    }
    setSelectedContact(contact);
    setReplyOpen(true);
  };

  const handleReplyClose = () => {
    setReplyOpen(false);
    setReplySubject('');
    setReplyMessage('');
  };

  const handleSendReply = async () => {
    const loadingToast = toast.loading('Sending reply...');
    setLoading(true); // Set loading to true
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      };
      await axios.post(`https://b-path-way-to-pardesh.onrender.com/api/admin/contact/${selectedContact._id}/reply`, {
        subject: replySubject,
        message: replyMessage
      }, config);
      setContacts(contacts.map(contact => contact._id === selectedContact._id ? { ...contact, status: 'completed' } : contact));
      handleReplyClose();
      setSloading(false);
      toast.success('Reply sent successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error sending reply:', error);
      setSloading(false);
      toast.error(error.response ? error.response.data.message : 'Error sending reply. Please try again.', { id: loadingToast });
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <>
      <NavbarAdmin />
     {
      Sloading ? (
        <div><LoadingSpinner /></div>
      ) : (
        <>
         <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Contact Messages</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Send Reply</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleOpen(contact.description)}>
                      View Description
                    </Button>
                  </TableCell>
                  <TableCell>{contact.user ? `${contact.user.name} (${contact.user.email})` : 'Guest'}</TableCell>
                  <TableCell>{contact.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleReplyOpen(contact)} style={{ marginLeft: '10px' }}>
                      Send Reply
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(contact._id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Description</DialogTitle>
        <DialogContent dividers style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography>{selectedDescription}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={replyOpen} onClose={handleReplyClose} maxWidth="sm" fullWidth>
        <DialogTitle>Send Reply</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Subject"
            fullWidth
            value={replySubject}
            onChange={(e) => setReplySubject(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReplyClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendReply} color="primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )
     }
    </>
  );
};

export default AdminContactUs;
