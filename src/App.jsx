import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Slides from './components/ui/Slides'
import TourList from './components/TourList'
import GridComponent from './components/AboutUs'
import DestinationGrid from './components/PopularTours'
import Login from './pages/Login'
import Register from './pages/Register'
import TourDescription from './pages/TourDescription'
import Error from './components/Error'
import TourL from './components/ThematicTours'
import AllTours from './pages/AllTours'
import Сabinet from './pages/Сabinet'
import RootLayout from './layout/RootLayout'
import NotFound from './components/NotFound'
import {Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import CabinetLayout from './layout/CabinetLayout'
import Cabinet from './pages/Сabinet'
import Booking from './pages/Booking'
import Filters from './components/Filters'
import { useDispatch, useSelector } from 'react-redux';
import { checkLoggedInUser } from './features/authentication/logoutSlice'
import ImageGrid from './components/ImageSlider'
import AgencyReviews from './pages/AgencyReviews'
import AboutusPage from './pages/AboutusPage'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkLoggedInUser()); 
  }, [dispatch]);
  
    const router = createBrowserRouter(
      createRoutesFromElements(
         <>
         <Route element={<RootLayout />}>
           <Route index element={<Home />} />
           <Route path="tour/:id" element={<TourDescription />} errorElement={<Error />} />
           <Route path="alltours" element={<AllTours />} />
           <Route path="reviews" element={<AgencyReviews />} />
           <Route path="aboutus" element={<AboutusPage />} />
           <Route path="cabinet" element={<CabinetLayout />}>
              <Route index element={<Cabinet />} />
              <Route path="likedTours" element={<Cabinet />} />
              <Route path="booking" element={<Booking/>} />
            </Route>
         </Route>
            <Route path="login" element={<AuthLayout><Login /></AuthLayout>} />
         <Route path="register" element={<AuthLayout><Register /></AuthLayout>} />
         <Route path="*" element={<NotFound />} />
       </>
      )
    )

    return (
      <RouterProvider router={router}/>
    )
}

const Home = () => {
  const { tours } = useSelector((state) => state.tours);
  return <>

      <Slides className='-z-10'/>
      <Filters/>
      <Name main="Знайди свою найкращу" other="країну" />
      <ImageGrid />
      <Name main="Усі тури" other=""/>
      <TourList tours={tours}/>
      <Name main="Чому ми" other=""/>
      <GridComponent />
      <Name main="Найпопулярніші напрямки" other="турів"/>
      <DestinationGrid />
      <Name main="Тематичні" other="тури"/>
      <TourL/>

  </>
};
  
const Name = (props) =>(
  <div class="flex justify-center items-center">
    <h1 className='capitalize text-[#361d32] text-xl my-4 lg:my-10 lg:text-3xl'>
        <span className='font-semibold'>{props.main}</span> {props.other}
    </h1>
</div>
)

const AuthLayout = ({ children }) => (
  <div
    className="text-white h-[100vh] flex justify-center items-center bg-cover bg-center"
    style={{
      backgroundImage: 'linear-gradient(to top, rgba(54, 29, 50, 0.7), rgba(0, 0, 0, 0)), url("../src/assets/ken-cheung-KonWFWUaAuk-unsplash.jpg")',
    }}
  >
    {children}
  </div>
);



export default App
