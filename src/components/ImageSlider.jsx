import '../App.css';
import { useState } from 'react';
import img0 from '../assets/0.jpg';
import img1 from '../assets/1.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';
import img7 from '../assets/7.jpg';
import img9 from '../assets/9.jpg';
import img11 from '../assets/11.jpg';
import img13 from '../assets/13.jpg';
import img14 from '../assets/14.jpg';
import img15 from '../assets/15.jpg';
import img16 from '../assets/16.jpg';
import img17 from '../assets/17.jpg';
import img20 from '../assets/20.jpg';
import img21 from '../assets/tanzania.jpg'
import img22 from '../assets/22.jpg'
import img23 from '../assets/23.jpg'
import img24 from '../assets/24.jpg'
import img25 from '../assets/25.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters } from '../features/tours/toursSlice';
import { resetFilters as resetMainFilters } from '../features/tours/toursSlice';
import { resetFilters as resetDetailsFilters } from '../features/tours/tourDetailsSlice';

const ImageGrid = () => {
  const [more, setMore] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCountrySelect = (country) => {
    dispatch(resetMainFilters());
    dispatch(resetDetailsFilters());
    dispatch(setFilters({ countries: country }));
    navigate("/alltours");
  };

  const images = [ 
    {image: img0, text: "Україна" },
    {image: img21, text: "Танзанія" }, 
    {image: img22, text: "Австрія" }, 
    {image: img1, text: "Туреччина" }, 
    {image: img3, text: "Франція" }, 
    {image: img4, text: "Мексика" }, 
    {image: img5, text: "Японія" }, 
    {image: img6, text: "Іспанія" }, 
    {image: img7, text: "Таїланд" }, 
    {image: img15, text: "Швейцарія" }, 
    {image: img9, text: "Італія" }, 
    {image: img16, text: "Єгипет" }, 
    {image: img11, text: "Німеччина" },
    {image: img17, text: "Греція" }, 
    {image: img13, text: "США" },
    {image: img14, text: "Чехія" }, 
    {image: img20, text: "Португалія" },
    {image: img23, text: "Мальдіви" },
    {image: img24, text: "Нідерланди" },
    {image: img25, text: "Непал" },
  ];
  
  const rotationClasses = [
    "rotate-6", "-rotate-3", "rotate-3", "-rotate-6"
  ];

  return (
    <> 
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-7 max-w-6xl px-4 mx-auto mt-6 cursor-pointer">
    {(more ? images : images.slice(0, 10)).map((image, index) => (
  <div 
    key={image.text} 
    className={`relative rounded-3xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 ${rotationClasses[index % rotationClasses.length]}`}
    onClick={() => handleCountrySelect(image.text)}
    role="button"
    tabIndex={0}
  >
    <div className="absolute inset-0 bg-black opacity-30"></div>
    <img src={image.image} alt={`Країна ${index + 1}`} className="w-full h-[20vh] md:h-40 object-cover"
      onClick={() => handleCountryChange(image.text)} />
    <div className="absolute bottom-4 left-4 text-white font-bold text-lg  px-3 py-1 rounded-lg">
      {image.text}
    </div>
  </div>
))}

    </div>
    <div className="flex justify-center mt-6">
  <button 
    type="button" 
    className="text-sm text-[#361d32] underline" 
    onClick={() => setMore(!more)}
  >
   {more ? "Менше" : "Більше"}
  </button>
</div>
    </>   
  );
};

export default ImageGrid;
