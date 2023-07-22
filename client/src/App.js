import React from 'react';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import { Protectroute } from './middleware/auth';
/**import all components */
import Password from './components/Password';
import Profile from './components/Profile';
import Reset from './components/Reset';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Pagenotfound from './components/Pagenotfound';
import Username from './components/Username';
/**auth middleware */
import { AuthorizeUser } from './middleware/auth';
/**root routes */
const router=createBrowserRouter(
    [
        {
            path:'/',
            element:<Username/>
        },
        {
          path:'/register',
          element:<Register/>
        },
        {
          path:'/password',
          element:<Protectroute><Password/></Protectroute>
        }
        ,{
          path:'/profile',
          element:<AuthorizeUser><Profile/></AuthorizeUser>
        },
        {
          path:'/recovery',
          element:<Recovery/>
        },
        {
          path:'/reset',
          element:<Reset/>
        },
        {
          path:'*',
          element:<Pagenotfound/>
        }
    ]
)
const App = () => {
  return (
    <main>
     <RouterProvider router={router}></RouterProvider>
    </main>
  )
}

export default App;
