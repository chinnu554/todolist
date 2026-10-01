import Homepage from "./pages/Homepage/Homepage.jsx";
import Loginpage from "./pages/Loginpage/Loginpage.jsx";
import {Routes , Route} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import "./App.css"

function App(){
  return(
    <div className="app">
      <Header/>
      <div className="body">
        <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/auth" element={<Loginpage/>}/>
      </Routes>
      </div>
    </div>
  )
}

export default App;