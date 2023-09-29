import React, { Component } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Redirect } from 'react-router-dom';

class UpdateTaskStatus extends Component {
  state = {
    task: null,
    newStatus: '',
    selectedUser: '',
    users: [],
    newPriority: '',
    redirectToDashboard: false,
  };

  componentDidMount() {
    // Fetch the task by ID when the component mounts
    const taskId = this.props.match.params.taskId;
    axios
      .get(`http://127.0.0.1:8000/tasks/view/${taskId}/`)
      .then((response) => {
        this.setState({ task: response.data });
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
    axios
      .get('http://127.0.0.1:8000/tasks/users/')
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }

  handleStatusChange = (e) => {
    // Update the new status in the component state
    this.setState({ newStatus: e.target.value });
  };

  handleUserChange = (e) => {
    // Update the selected user in the component state
    this.setState({ selectedUser: e.target.value });
  };

  handlePriorityChange = (e) => {
    this.setState({ newPriority: e.target.value });
  };

  handleUpdateAll = () => {
    const { taskId } = this.props.match.params;
    const { newStatus, selectedUser, newPriority } = this.state;

    // Validate that required fields are not empty
    if (!newStatus && !selectedUser && !newPriority) {
      console.error('Please select at least one value to update.');
      return;
    }

    // Create an object with non-empty values
    const updatedFields = {};
    if (newStatus) updatedFields.status = newStatus;
    if (selectedUser) updatedFields.username = selectedUser;
    if (newPriority) updatedFields.priority = newPriority;

    // Send a PATCH request to update the task with the selected values
    axios
      .patch(`http://127.0.0.1:8000/tasks/update_task/${taskId}/`, updatedFields)
      .then((response) => {
        // Handle success, e.g., show a success message or navigate back
        console.log('Task updated successfully:', response.data);

        this.setState({
          redirectToDashboard: true,
        });
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error('Error updating task:', error);
      });
  };

  render() {
    const {
      task,
      newStatus,
      users,
      selectedUser,
      newPriority,
      redirectToDashboard,
    } = this.state;

    if (redirectToDashboard) {
      // Redirect to the dashboard after task creation
      return <Redirect to="/" />;
    }

    if (!task) {
      return <div>Loading...</div>;
    }

    return (
      <Paper elevation={3} style={{ padding: '20px', margin: '20px', maxWidth: '800px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Update Task Detail
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head">Title:</TableCell>
              <TableCell>{task.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Description:</TableCell>
              <TableCell>{task.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Due Date:</TableCell>
              <TableCell>{task.due_date}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Status:</TableCell>
              <TableCell>
                  <Select
                    id="newStatus"
                    value={newStatus || task.status || ''}
                    onChange={this.handleStatusChange}
                    autoWidth
                  >
                    <MenuItem disabled>Select Status</MenuItem>
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                  </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Assigned To:</TableCell>
              <TableCell>
                <Select
                  id="userDropdown"
                  value={selectedUser || task.assigned_to}
                  onChange={this.handleUserChange}
                  autoWidth
                >
                  <MenuItem disabled>Select a User</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.username}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Priority:</TableCell>
              <TableCell>
                <Select
                  id="newPriority"
                  value={newPriority || task.priority}
                  onChange={this.handlePriorityChange}
                  autoWidth
                >
                  <MenuItem disabled>Select Priority</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div style={{ marginTop: '10px' }}>
          <Button
            onClick={this.handleUpdateAll}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </Paper>
    );
  }
}

export default UpdateTaskStatus;
