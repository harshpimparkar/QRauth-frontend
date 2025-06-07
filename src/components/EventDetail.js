// src/components/EventDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { QRCodeSVG as QRCode } from 'qrcode.react';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const [eventRes, userRes] = await Promise.all([
          axios.get(`https://qrauth-backend-1.onrender.com/api/events/${id}`),
          axios.get('https://qrauth-backend-1.onrender.com/api/user/events', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setEvent(eventRes.data);
        
        // Check if current user is the organizer
        setIsOrganizer(userRes.data.organizedEvents.some(e => e._id === id));
        
        // Check if current user is registered
        setIsRegistered(userRes.data.volunteerEvents.some(e => e._id === id));
        
        // If organizer, fetch volunteers details
        if (userRes.data.organizedEvents.some(e => e._id === id)) {
          const volunteersRes = await axios.get(`https://qrauth-backend-1.onrender.com/api/events/${id}/volunteers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setVolunteers(volunteersRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      await axios.post(`https://qrauth-backend-1.onrender.com/api/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsRegistered(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>Loading...</Box>;
  }

  if (!event) {
    return <Typography variant="h6" sx={{ mt: 4 }}>Event not found</Typography>;
  }

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Events
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        {event.title}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                📅 {new Date(event.date).toLocaleDateString()} 
                {' at '}
                🕒 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                📍 {event.location}
              </Typography>
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {event.description}
              </Typography>
              
              {!isOrganizer && !isRegistered && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRegister}
                  sx={{ mt: 2 }}
                >
                  Register as Volunteer
                </Button>
              )}
              
              {isRegistered && (
                <Box sx={{ mt: 2 }}>
                  <Chip label="Registered" color="success" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Don't forget to scan the QR code at the event to mark your attendance!
                  </Typography>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/scan"
                    sx={{ mt: 2 }}
                  >
                    Scan QR Code
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {isOrganizer && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Organizer Tools
              </Typography>
              <Typography variant="body2" gutterBottom>
                Share this QR code with volunteers to scan at the event:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <QRCode value={event.qrCodeData} size={200} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Volunteers Registered: {event.volunteers.length}
              </Typography>
            </Paper>
          )}
          
          {isOrganizer && volunteers.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Volunteers
              </Typography>
              <List>
                {volunteers.map((volunteer, index) => (
                  <React.Fragment key={volunteer._id}>
                    <ListItem>
                      <ListItemText
                        primary={volunteer.name}
                        secondary={
                          volunteer.eventsAttended.get(id) 
                            ? 'Attendance confirmed' 
                            : 'Pending attendance'
                        }
                      />
                      {volunteer.eventsAttended.get(id) && (
                        <Chip label="Attended" color="success" size="small" />
                      )}
                    </ListItem>
                    {index < volunteers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default EventDetail;