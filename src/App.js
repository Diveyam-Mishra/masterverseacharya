import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Religion from '..//src//Components//Religion';
import './App.css';
import Navbar from './Components/Navbar';

function App() {
  return (
    <>
      <div>

      </div>
        <Navbar title={<img src="Logo SVG 2.png" alt="Logo" />} />
        <Religion></Religion>
        <footer id = "foot">
          <div></div>
        </footer>
      </>
  );
}

export default App;
