// src/components/Events.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  Paper
} from '@mui/material';

function Events() {
  const [events, setEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // All events
        const allRes = await axios.get('/api/events');
        setEvents(allRes.data);
        
        // User-specific events
        const userRes = await axios.get('/api/user/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrganizedEvents(userRes.data.organizedEvents);
        setVolunteerEvents(userRes.data.volunteerEvents);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await axios.post(`https://qrauth-backend-1.onrender.com/api/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refresh events
      const res = await axios.get('https://qrauth-backend-1.onrender.com/api/user/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVolunteerEvents(res.data.volunteerEvents);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Beach Cleanup Events
      </Typography>
      
      <Button
        component={Link}
        to="/create-event"
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
      >
        Create New Event
      </Button>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Events" />
          <Tab label="My Organized Events" />
          <Tab label="My Volunteer Events" />
        </Tabs>
      </Paper>
      
      <Grid container spacing={3}>
        {tabValue === 0 && events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()} at {event.location}
                </Typography>
                <Typography variant="body2" component="p">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Organized by: {event.organizer.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/event/${event._id}`}
                >
                  View Details
                </Button>
                {!volunteerEvents.some(e => e._id === event._id) && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
        
        {tabValue === 1 && organizedEvents.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()} at {event.location}
                </Typography>
                <Typography variant="body2" component="p">
                  {event.description}
                </Typography>
                <Typography variant="body2">
                  Volunteers: {event.volunteers.length}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/event/${event._id}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        
        {tabValue === 2 && volunteerEvents.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()} at {event.location}
                </Typography>
                <Typography variant="body2" component="p">
                  {event.description}
                </Typography>
                <Typography variant="body2">
                  Organized by: {event.organizer.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/event/${event._id}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Events;