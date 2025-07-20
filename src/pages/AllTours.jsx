import React, { useEffect, useMemo  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTours } from '../features/tours/toursSlice';
import Filters from '../components/Filters';
import TourList from '../components/TourList';
import Loading from '../components/ui/Loading';
import Error from '../components/Error'

const AllTours = () => {
  const dispatch = useDispatch();

  const { popularTours, filteredTours, loading, error } = useSelector((state) => state.tours);
const toursToDisplay = popularTours?.length ? popularTours : filteredTours;

  useEffect(() => {
    dispatch(fetchTours());
  }, [dispatch]);

  if (loading) return <Loading/>;
  if (error) return <Error /> ;

  return (
    <>
      <Filters />
      <TourList tours={toursToDisplay} />
    </>
  );
};

export default React.memo(AllTours);