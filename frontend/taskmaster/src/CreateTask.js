import React, { Component } from 'react';
import './CreateTask.css';

class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: {
        title: '',
        description: '',
        due_date: '',
      },
    };
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
        // Optionally, reset the form
        this.setState({
          task: {
            title: '',
            description: '',
            due_date: '',
          },
        });
      } else {
        // Handle error response
        console.error('Error creating task.');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };

  render() {
    return (
        <div className="form-container">
          <h1 className="heading">Create Task</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              className="form-input"
              type="text"
              name="title"
              placeholder="Task Title"
              value={this.state.title}
              onChange={this.handleInputChange}
            />
            <textarea
              className="form-input"
              name="description"
              placeholder="Task Description"
              value={this.state.description}
              onChange={this.handleInputChange}
            ></textarea>
            <input
              className="form-input"
              type="date"
              name="due_date"
              placeholder="Due Date"
              value={this.state.due_date}
              onChange={this.handleInputChange}
            />
            <button className="submit-button" type="submit">
              Submit
            </button>
          </form>
          {this.state.error && (
            <div className="error-message">{this.state.error}</div>
          )}
        </div>
    );
  }
}

export default CreateTask;