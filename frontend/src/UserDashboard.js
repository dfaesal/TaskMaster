import React, { Component } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableCell, TableRow, Paper, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'green';
    default:
      return 'black';
  };
}

class UserDashboard extends Component {
  state = {
    tasks: [],
  };

  componentDidMount() {
    const user = this.props.location.state.user[0];
    // Fetch user's tasks when the component mounts
    axios.get(`http://127.0.0.1:8000/tasks/view/?user=${user.name}&role=${user.role}`)
      .then((response) => {
        this.setState({ tasks: response.data });
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }

  render() {
    const { tasks } = this.state;

    return (
      <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          User Dashboard
        </Typography>
        <Button
          component={Link}
          to={{pathname: "/create-task", state: {user: this.props.location.state.user}}}
          variant="contained"
          color="primary"
          style={{ position: 'absolute', top: '30px', right: '30px' }}
        >
          Create Task
        </Button>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f2f2f2' }}>
              <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Priority</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>
                  <Box
                    component="div"
                    display="block"
                    p={1}
                    borderRadius="10px"
                    bgcolor={getPriorityColor(task.priority)}
                    width="60px"
                    textAlign="center"
                  >
                    {task.priority}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={{pathname: `/update-task/${task.id}`, state: {user: this.props.location.state.user}}}
                    variant="contained"
                    color="primary"
                  >
                    Update Task
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default UserDashboard;