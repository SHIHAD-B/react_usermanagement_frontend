import './App.css'
import axios from 'axios'
import { Router } from './components/router'

axios.defaults.withCredentials=true;

function App() {


  return (
    <>
  <Router/>
   </>
  )
}

export default App
