import Homepage from "./pages/Homepage/Homepage.jsx";
import Loginpage from "./pages/Loginpage/Loginpage.jsx";
import {Routes , Route} from "react-router-dom";
import Header from "./components/Header/Header.jsx";

function App(){
  return(
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/auth" element={<Loginpage/>}/>
      </Routes>
    </div>
  )
}

export default App;