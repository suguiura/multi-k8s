import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Fib from './Fib';


function App() {
  return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div>
                <Route exact path="/" component={Fib} />
            </div>
          </header>
        </div>
      </Router>
  );
}

export default App;
