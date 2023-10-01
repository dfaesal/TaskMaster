import React, { Component } from 'react';
import { TextField, Button, Container, Typography, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Registration extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    role: '',
    error: '',
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRegistration = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await axios.post('http://127.0.0.1:8000/tasks/register/', this.state);
      console.log(response.data); // Handle successful registration

      // Redirect to login after successful registration
      this.props.history.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      this.setState({ error: 'Registration failed. Please check your details and try again.' });
    }
  };

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" color="primary" variant="h5">
            Registration
          </Typography>
          {this.state.error && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {this.state.error}
            </Typography>
          )}
          <form onSubmit={this.handleRegistration}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={this.handleInputChange}
              sx={{ backgroundColor: '#e0e0e0', borderRadius: '5px', marginBottom: '10px' }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              onChange={this.handleInputChange}
              sx={{ backgroundColor: '#e0e0e0', borderRadius: '5px', marginBottom: '10px' }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={this.handleInputChange}
              sx={{ backgroundColor: '#e0e0e0', borderRadius: '5px', marginBottom: '10px' }}
            />
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label htmlFor="role">Role:</label>
              <Select
                id="role"
                value={this.state.role}
                onChange={this.handleInputChange}
                fullWidth
                name="role"
                sx={{ backgroundColor: '#e0e0e0', borderRadius: '5px', marginBottom: '10px' }}
              >
                <MenuItem value="team_leader">Team Leader</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '20px', backgroundColor: '#3f51b5' }}
            >
              Register
            </Button>
            <Link to="/login">
              <Button fullWidth variant="contained" color="primary" style={{ marginTop: '20px', backgroundColor: '#3f51b5' }} >
                Login
              </Button>
            </Link>
          </form>
        </Box>
      </Container>
    );
  }
}

export default Registration;
