import React, { Component } from 'react';
import { TextField, Button, Container, Typography, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Login extends Component {
  state = {
    username: '',
    password: '',
    role: '',
    error: '',
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await axios.post('http://127.0.0.1:8000/tasks/login/', this.state);
      console.log(response.data); 
      const user = response.data; // Assuming the user details are returned in the response

      // Redirect to dashboard after successful login
      this.props.history.push({
        pathname: '/dashboard',
        state: { user: user },
      });
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ error: error.response.data['message'] });
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
            Login
          </Typography>
          {this.state.error && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {this.state.error}
            </Typography>
          )}
          <form onSubmit={this.handleLogin}>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handleInputChange}
            />
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label htmlFor="role">Role:</label>
              <Select
                id="role"
                value={this.state.role}
                onChange={this.handleInputChange}
                fullWidth
                name="role"
                required
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
              Login
            </Button>
            <Link to="/register">
              <Button fullWidth variant="outlined" color="primary" sx={{ mt: 2 }}>
                Register
              </Button>
            </Link>
          </form>
        </Box>
      </Container>
    );
  }
}

export default Login;
