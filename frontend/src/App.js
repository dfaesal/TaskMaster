//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import UserDashboard from './UserDashboard';
import CreateTask from './CreateTask';
import UpdateTaskStatus from './UpdateTaskStatus';
import Login from './Login';
import Registration from './Registration';

function App() {
  return (
    <div className="container">
    <div className='App-body'>
      <BrowserRouter>
          <Route path="/" exact render={() => <Redirect to='/login' />} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Registration} />
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/create-task" component={CreateTask} />
          <Route path="/update-task/:taskId" component={UpdateTaskStatus} />
          </BrowserRouter>
        </div>
      </div>
  );
}

export default App;
