import './App.css'
//import Register from './components/login/Register.js'
import { BrowserRouter as Router } from "react-router-dom"
import Routes from './components/routes/Routes'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes/>
      </Router>
    </div>
  );
}

export default App;
