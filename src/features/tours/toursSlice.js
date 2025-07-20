import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  tours: [],
  selectedTour: null,
  error: "",
  cities: [],
  countries: [],
  minPrice:0,
  maxPrice:0,
  filters: { 
    searchQuery: "",
    selectedCountry: "", 
    countries: "", 
    startDate: null, 
    endDate: null, 
    adults: null, 
    children: null, 
    hasChildren:false,
    hotTours: false, 
    promotion:false, 
    selectedCity: "", 
    minPrice:0,
    maxPrice:undefined,
    transport: null, 
    selectedFood: [],
    popularTours: false,
    premiumTours: false,
  }, 
  filteredTours: [], 
  selectedCity: "", 
  popularTours: [],
};

export const fetchTours = createAsyncThunk('tour/fetchTours', async () => {
  
  const response = await axios.get('https://my-django-project-7203.onrender.com/tours/?format=json');
  return response.data;
});

export const fetchTourById = createAsyncThunk('tourDetails/fetchTourById', async (id) => {
  try {
    const response = await axios.get(`https://my-django-project-7203.onrender.com/tours/${id}/?format=json`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
});

const toursSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredTours = filterTours(state.tours, state.filters);
    },
    toggleHotToursFilter: (state) => {
      state.filters = {
        ...initialState.filters,
        hotTours: !state.filters.hotTours
      };
      state.filteredTours = filterTours(state.tours, state.filters);
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;  
      state.filters.city = action.payload; 
      state.filteredTours = filterTours(state.tours, state.filters);
    },
    setSelectedCountry: (state, action) => {
      state.filters.selectedCountry = action.payload;
      state.filteredTours = filterTours(state.tours, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredTours = state.tours;
      state.popularTours = [];

    },
    setPopularTours: (state, action) => {
      state.popularTours = action.payload;
    },
    togglePopularToursFilter: (state) => {
      state.filters.popularTours = !state.filters.popularTours;
      state.filteredTours = filterTours(state.tours, state.filters, state.popularTours);
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;

        const uniqueCountries = [];
        action.payload.forEach(tour => {
          if (tour.countries) {
            const countriesArray = tour.countries.split(',').map(country => country.trim());
            countriesArray.forEach(country => uniqueCountries.push(country));
          }
        });

        state.countries = uniqueCountries.filter((country, index) => {
          return uniqueCountries.indexOf(country) === index;
        });

        const uniqueCities = [];
        action.payload.forEach(tour => {
          if (tour.countries && tour.cities) {
            const citiesArray = tour.cities
              .split(',')
              .map(city => city.trim())
              .filter(city => city !== ''); 
        
            citiesArray.forEach(city => uniqueCities.push(city));
          }
        });
        state.cities = uniqueCities;
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        action.payload.forEach(tour => {
          const price = tour.promotion ? parseFloat(tour.price_promotion) : parseFloat(tour.price);
          if (price < minPrice) {
            minPrice = price;
          }

          if (price > maxPrice) {
            maxPrice = price;
          }
        });

        state.minPrice = minPrice;
        state.maxPrice = maxPrice;

        state.filteredTours = filterTours(action.payload, state.filters, state.popularTours); 

      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTour = action.payload;
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const filterTours = (tours, filters = {}) => {
  return tours.filter((tour) => {
    const { 
      searchQuery, 
      countries, 
      cities, 
      selectedCity,
      startDate, 
      endDate, 
      adults, 
      children,
      hasChildren,
      hotTours,
      promotion,
      minPrice=0,
      maxPrice=Infinity,
      transport,
      selectedFood, 
      popularTours: isPopularTours,
      premiumTours,
    } = filters;

    const countriesArray = tour.countries ? tour.countries.split(',').map(c => c.trim()) : [];
     const citiesArray = tour.cities ? tour.cities.split(',').map(c => c.trim()) : [];

    const tourStartDate = new Date(tour.start_date);
    const tourEndDate = new Date(tour.end_date);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;

    const isDateInRange = 
      (!filterStartDate || tourEndDate >= filterStartDate) && 
      (!filterEndDate || tourStartDate <= filterEndDate);

    const isSearchMatch = !searchQuery || 
      tour.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isCountryMatch = !countries || 
      tour.countries.includes(countries);
    const isCityMatch = !cities || 
      tour.cities.includes(cities);
    const isAdultsMatch = adults === null || 
      tour.adults >= adults;
    const isChildrenMatch = children === null || 
      tour.children == children;
      const isHasChildrenMatch = !hasChildren || tour.children > 0;
      const isHotTourMatch = !hotTours || tour.hot_deal;
    const isPromotionMatch = !promotion || tour.promotion;
    const isTransportMatch = !transport || tour.departure_by === transport;

      const isCityAndHotTourMatch = (!cities || tour.cities.includes(cities)) &&
      (!hotTours || tour.hot_deal === true);

      let price = Number(tour.promotion ? tour.price_promotion : tour.price);

      const isFoodMatch =
      !selectedFood.length || selectedFood.includes(tour.food);

      const isCity = !selectedCity || 
      tour.cities.includes(selectedCity);

      const isPopularTourMatch =
      !isPopularTours || popularTours.some((popular) => popular.id === tour.id);

      const isPremiumTourMatch = !filters.premiumTours || price >= 100000;

    return (
      isSearchMatch &&
      isCountryMatch &&
      isCityMatch &&
      isDateInRange &&
      isAdultsMatch &&
      isChildrenMatch &&
      isHasChildrenMatch &&
      isHotTourMatch &&
      isCityAndHotTourMatch &&
      price >= minPrice && 
      price <= maxPrice &&
      isPromotionMatch &&
      isTransportMatch &&
      isFoodMatch &&
      isCity &&
      isPopularTourMatch &&
      isPremiumTourMatch
      );
  });
};

export const { setFilters,toggleHotToursFilter, resetFilters, setSelectedCity, setSelectedCountry, setPopularTours, togglePopularToursFilter, } = toursSlice.actions;
export default toursSlice.reducer;
