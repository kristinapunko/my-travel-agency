import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTourById } from '../features/tours/toursSlice';
import { fetchTourDetailsById } from '../features/tours/tourDetailsSlice';
import { fetchLikedTours, toggleLike, selectLikedTourIds } from '../features/сabinet/likedToursSlice';
import TourCard from '../components/ui/TourCard';
import { fetchReviews } from '../features/tours/reviewsSlice';
import Loading from '../components/ui/Loading';

const Cabinet = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const dispatch = useDispatch();

  const token = localStorage.getItem('accessToken');
  const tours = useSelector((state) => state.tours.tours);
  const likedTourIds = useSelector((state) => state.likedTours.likedTourIds || []); 
  const reviews = useSelector((state) => state.reviews.reviews); 
  const loading = useSelector((state) => state.likedTours.loading);
  const error = useSelector((state) => state.likedTours.error);

  const [localTours, setLocalTours] = useState({});
  const [localTourDetails, setLocalTourDetails] = useState({});

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      try {
        if (likedTourIds.length === 0) {
          await dispatch(fetchLikedTours()).unwrap();
        }

        const newTours = { ...tours };
        const newDetails = { ...localTourDetails };

        for (const tourId of likedTourIds) {
          try {
            if (!newTours[tourId]) {
              const tour = await dispatch(fetchTourById(tourId)).unwrap();
              newTours[tourId] = tour;
            }
        
            if (!newDetails[tourId]) {
              const details = await dispatch(fetchTourDetailsById(tourId)).unwrap();
              newDetails[tourId] = details;
        
              await dispatch(fetchReviews(tourId)).unwrap();
            }
          } catch (err) {
            console.error(`Помилка при завантаженні туру ${tourId}:`, err);
          }
        }

        setLocalTours(newTours);
        setLocalTourDetails(newDetails);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Помилка при завантаженні улюблених турів:', error);
        if (error.message.includes('401')) {
          localStorage.removeItem('accessToken');
          alert('Сесія закінчилася. Будь ласка, увійдіть знову.');
        }
      }
    };

    loadData();
  }, [dispatch, token, likedTourIds]);

  const handleToggleLike = (tourId, event) => {
    dispatch(toggleLike(tourId)).unwrap().catch((error) => {
      if (error.message.includes('401')) {
        localStorage.removeItem('accessToken');
        alert('Сесія закінчилася. Будь ласка, увійдіть знову.');
      } else {
        alert('Сталася помилка. Будь ласка, спробуйте ще раз.');
      }
    });
  };

  const getFullTourInfo = (tourId) => {
    const tour = localTours[tourId];
    const details = localTourDetails[tourId];

    if (!tour) {
      console.warn(`Tour data missing for id ${tourId}`);
    }
    if (!details) {
      console.warn(`Tour details missing for id ${tourId}`);
    }

    return { id: tourId, ...(tour || {}), ...(details || {}) };
  };

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">Будь ласка, увійдіть до системи</p>
        <Link
          to="/login"
          className="bg-[#543c52] text-white px-6 py-2 rounded-lg hover:bg-[#361d32] transition"
        >
          Увійти
        </Link>
      </div>
    );
  }

  if (error) return <div>Сталася помилка: {error}</div>;

  if (!likedTourIds.length) {
    return (
      <div className="flex mx-auto bg-[#f1e8e6] w-[80%] rounded-2xl items-center justify-center h-60 mb-4">
        <div className="text-[#543c52] text-2xl font-medium">
          У вас немає улюблених турів
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="capitalize text-[#361d32] text-xl lg:text-3xl font-semibold mb-6">
        Улюблені тури
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedTourIds.map((tourId) => {
          const fullTour = getFullTourInfo(tourId);
          const tourReviews = reviews.filter(review => review.tourId === tourId);
          if (!isDataLoaded && loading && !fullTour.id || !localTours[tourId] || !localTourDetails[tourId]) {
            return <Loading />; 
          }
          
          return fullTour.id ? (
            <TourCard
              key={tourId}
              tour={{ ...fullTour, id: tourId }}
              details={fullTour}
              reviews={tourReviews}  
              onLikeClick={(e) => handleToggleLike(tourId, e)}
              isLiked={true}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Cabinet;
