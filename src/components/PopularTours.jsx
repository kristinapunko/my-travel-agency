import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import Rome from '../assets/Rome.jpg';
import Lviv from '../assets/Lviv.jpg';
import PortLouis from '../assets/PortLouis.jpg';
import Bangkok from '../assets/Bangkok.jpg';
import Zurich from '../assets/Zurich.jpg';
import Barcelona from '../assets/Barcelona.jpg';
import Athens from '../assets/Athens.jpg';
import Sharmel from '../assets/Sharmel-Sheikh.png';
import Pariss from '../assets/Pariss.jpg';
import { FiArrowRight} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../features/tours/reviewsSlice";

const des = [
  { name: "Цюріх", image: Zurich },
  { name: "Бангкок", image: Bangkok },
  { name: "Порт-Луї", image: PortLouis },
  { name: "Львів", image: Lviv },
  { name: "Рим", image: Rome },
  { name: "Барселона", image: Barcelona },
  { name: "Афіни", image: Athens },
  { name: "Шарм-ель-Шейх", image: Sharmel },
  { name: "Париж", image: Pariss },
];

import { useNavigate } from 'react-router-dom';
import { setPopularTours } from '../features/tours/toursSlice'; // додай сюди

const cityImages = {
  image1: Zurich,
  image2: Bangkok,
  image3: PortLouis,
  image4: Lviv,
  image5: Rome,
  image6: Barcelona,
  image7: Athens,
  image8: Sharmel,
  image9: Pariss
};

const DestinationGrid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours.tours);
  const allReviews = useSelector((state) => state.reviews.reviews);
  const reviewsLoading = useSelector((state) => state.reviews.loading);
  const [groupedTours, setGroupedTours] = useState({});

  useEffect(() => {
    if (tours?.length) {
      const tourIds = tours.map((t) => t.id);
      dispatch(fetchReviews(tourIds));
    }
  }, [tours, dispatch]);

  useEffect(() => {
    if (tours?.length && allReviews?.length && !reviewsLoading) {
      const toursWithReviews = tours.map((tour) => {
        const tourReviews = allReviews.filter((r) => r.tour === tour.id);
        return {
          ...tour,
          reviewCount: tourReviews.length,
          averageRating: tourReviews.length
            ? tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length
            : 0,
        };
      });

      const grouped = {};
      toursWithReviews.forEach((tour) => {
        if (!grouped[tour.reviewCount]) {
          grouped[tour.reviewCount] = [];
        }
        grouped[tour.reviewCount].push(tour);
      });

      setGroupedTours(grouped);
    }
  }, [tours, allReviews, reviewsLoading]);

  const handleClick = (reviewCount) => {
    const toursWithSameReviews = groupedTours[reviewCount] || [];
    dispatch(setPopularTours(toursWithSameReviews));
    navigate('/alltours');
  };

  const sortedReviewCounts = Object.keys(groupedTours)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="w-4/5 mx-auto rounded-xl overflow-hidden rounded-lg mb-12">
       <div className="grid grid-cols-1 md:grid-cols-3 ">
        {sortedReviewCounts.map((reviewCount, index) => (
          <Destination
            key={reviewCount}
            tours={groupedTours[reviewCount]}
            image={cityImages[`image${index + 1}`] || '/images/placeholder.jpg'}
            onClick={() => handleClick(reviewCount)}
          />
        ))}
      </div>
    </div>
  );
};

const Destination = ({  tours, image, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full aspect-[4/3] overflow-hidden cursor-pointer shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
          isHovered ? 'brightness-50 scale-105' : 'brightness-100 scale-100'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      {isHovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
  <div className="text-center p-4 text-white max-w-full">
    <div className="text-sm flex flex-wrap justify-center gap-x-4 gap-y-2">
      {tours.map((tour) => (
        <span key={tour.id} className="transition-opacity hover:opacity-80">
          {tour.countries}
        </span>
      ))}
    </div>
  </div>

  <button 
    className="flex items-center gap-1 text-[#edd2cb] px-4 py-2 rounded-full 
              transition-all hover:bg-white/10 hover:gap-2 active:scale-95"
  >
    <span>Переглянути тури</span>
    <FiArrowRight className="text-xs transition-transform" />
  </button>
</div>
      )}
    </div>
  );
};

export default DestinationGrid;