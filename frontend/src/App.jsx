import Home from "./Pages/Home";
import Scroll from "./Components/Scroll";
import Layout from "./Components/Layout/Layout";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Forgot from "./Pages/Forgot";
import Upload from "./Pages/Upload";
import Dashboard from "./Pages/Dashboard";
import ResetPassword from "./Pages/ResetPassword";

function App(){
  return (<>
    
    <BrowserRouter>
      <Scroll>
        <Layout>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/signup' element={<SignUp/>} />
            <Route path='/forgot' element={<Forgot/>}/>
            <Route path='/upload' element={<Upload />} />
            <Route path="/predict" element={<Dashboard />}/>
            <Route path="/reset-password"element={<ResetPassword/>}/>
          </Routes>
          
        </Layout>
      </Scroll>
    </BrowserRouter>
    
  </>);
}
export default App;