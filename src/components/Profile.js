// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip
} from '@mui/material';

function Profile({ user }) {
  const [eventsAttended, setEventsAttended] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendedEvents = async () => {
      try {
        // Get all events where user is registered
        const res = await axios.get('/api/user/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Filter events where attended is true
        const attended = [];
        for (const [eventId, attendedStatus] of user.eventsAttended) {
          if (attendedStatus) {
            const event = res.data.volunteerEvents.find(e => e._id === eventId);
            if (event) attended.push(event);
          }
        }
        
        setEventsAttended(attended);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendedEvents();
  }, [user.eventsAttended]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>Loading...</Box>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
          </Box>
        </Box>
        
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Paper>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Events I've Attended
      </Typography>
      
      {eventsAttended.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          You haven't attended any events yet.
        </Typography>
      ) : (
        <List>
          {eventsAttended.map((event, index) => (
            <React.Fragment key={event._id}>
              <ListItem>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <>
                      {new Date(event.date).toLocaleDateString()} at {event.location}
                      <Chip 
                        label="Attended" 
                        color="success" 
                        size="small" 
                        sx={{ ml: 1 }} 
                      />
                    </>
                  }
                />
              </ListItem>
              {index < eventsAttended.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default Profile;