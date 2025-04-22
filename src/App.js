import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import Login from './pages/Login';

let routers = createBrowserRouter([
  {index:true , element:<Login/>},
  {path:"login" , element:<Login/>},
  {path:"signup" , element:<Signup/>},

  {path:'dashboard' , element:<Layout/>, children:[
    
    // {path:'*',element:<NotFound/>},

  ]},  
])


function App() {


  return  <RouterProvider router={routers}></RouterProvider>

}

export default App;
