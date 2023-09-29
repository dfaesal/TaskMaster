//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import UserDashboard from './UserDashboard';
import CreateTask from './CreateTask';
import UpdateTaskStatus from './UpdateTaskStatus';

function App() {
  return (
    <div className="container">
    <div className='App-body'>
      <BrowserRouter>
          <Route path="/" exact render={() => <Redirect to='/dashboard' />} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/create-task" component={CreateTask} />
          <Route path="/update-task/:taskId" component={UpdateTaskStatus} />
          </BrowserRouter>
        </div>
      </div>
  );
}

export default App;