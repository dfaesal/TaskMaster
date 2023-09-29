import React, { Component } from 'react';
import { TextField, Button, Paper, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      task: {
        title: '',
        description: '',
        due_date: '',
        assigned_to: '',
        priority: '',
      },
      redirectToDashboard: false,
      error: '',
    };
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/tasks/users/')
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      task: {
        ...prevState.task,
        [name]: value,
      },
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { task } = this.state;

    try {
      const response = await fetch('http://127.0.0.1:8000/tasks/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        // Task created successfully
        console.log('Task created successfully.');
        this.setState({ redirectToDashboard: true });
      } else {
        // Handle error response
        console.error('Error creating task.');
        this.setState({ error: 'Error creating task.' });
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
      this.setState({ error: 'Network error.' });
    }
  };

  render() {
    if (this.state.redirectToDashboard) {
      // Redirect to the dashboard after task creation
      return <Redirect to="/" />;
    }
    const { task } = this.state;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px', maxWidth: '500px', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h4" gutterBottom style={{ color: '#3f51b5' }}>
            Create Task
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Task Title"
              type="text"
              name="title"
              value={task.title}
              onChange={this.handleInputChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Task Description"
              name="description"
              multiline
              rows={4}
              value={task.description}
              onChange={this.handleInputChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              type="date"
              name="due_date"
              value={task.due_date}
              onChange={this.handleInputChange}
              fullWidth
              margin="dense"
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="assigned_to">Assigned To</InputLabel>
              <Select
                label="Assigned To"
                name="assigned_to"
                value={task.assigned_to}
                onChange={this.handleInputChange}
                fullWidth
              >
                {this.state.users.map((user) => (
                  <MenuItem key={user.id} value={user.username}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" required>
              <InputLabel htmlFor="priority">Priority</InputLabel>
              <Select
                label="Priority"
                name="priority"
                value={task.priority}
                onChange={this.handleInputChange}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '20px', backgroundColor: '#3f51b5' }}
            >
              Create Task
            </Button>
          </form>
          {this.state.error && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {this.state.error}
            </Typography>
          )}
        </Paper>
      </div>
    );
  }
}

export default CreateTask;
