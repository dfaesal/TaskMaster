import React, { Component } from 'react';
import axios from 'axios';
import './UpdateTaskStatus.css';

class UpdateTaskStatus extends Component {
  state = {
    task: null,
    newStatus: '',
    updatedStatus: '', // Add a state variable to store the updated status
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
  }

  handleStatusChange = (e) => {
    // Update the new status in the component state
    this.setState({ newStatus: e.target.value });
  };

  handleUpdateStatus = () => {
    // Send a request to update the task's status
    const taskId = this.props.match.params.taskId;
    axios
      .patch(`http://127.0.0.1:8000/tasks/update_task_status/${taskId}/`, {
        status: this.state.newStatus,
      })
      .then((response) => {
        // Handle success, e.g., show a success message or navigate back
        console.log('Task status updated successfully:', response.data);

        // Update the updatedStatus state with the new status
        this.setState({ updatedStatus: this.state.newStatus });
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error('Error updating task status:', error);
      });
  };

  render() {
    const { task, newStatus, updatedStatus } = this.state;

    if (!task) {
      return <div className="loading-message">Loading...</div>;
    }

    return (
      <div className="task-container">
        <h1 className="heading">Task Detail</h1>
        <div className="task-details">
          <div className="task-info">
            <p className="form-label">Title:</p>
            <p>{task.title}</p>
          </div>
          <div className="task-info">
            <p className="form-label">Description:</p>
            <p>{task.description}</p>
          </div>
          <div className="task-info">
            <p className="form-label">Due Date:</p>
            <p>{task.due_date}</p>
          </div>
          <div className="task-info">
            <p className="form-label">Status:</p>
            {/* Display the updated status if available, otherwise, show the task's status */}
            <p>{updatedStatus || task.status}</p>
          </div>
        </div>

        <div className="status-update">
          <label htmlFor="newStatus">New Status:</label>
          <select
            id="newStatus"
            value={newStatus}
            onChange={this.handleStatusChange}
            className="select-control"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          <button onClick={this.handleUpdateStatus} className="update-button">
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default UpdateTaskStatus;