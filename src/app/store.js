import { configureStore } from "@reduxjs/toolkit";
import toursReducer from '../features/tours/toursSlice'
import tourDetailsReducer from '../features/tours/tourDetailsSlice'
import registerSlice from "../features/authentication/registerSlice";
import loginSlice from "../features/authentication/loginSlice";
import authReducer from "../features/authentication/logoutSlice";
import likedToursSlice from "../features/сabinet/likedToursSlice";
import bookingReducer from "../features/сabinet/bookingSlice";
import reviewsReducer from "../features/tours/reviewsSlice";
import agencyReviewReducer from "../features/tours/agencyReviewSlice";

const store = configureStore({
    reducer:{
       tours: toursReducer,
       tourDetails: tourDetailsReducer,
       register: registerSlice,
       login: loginSlice,
       auth: authReducer,
       likedTours: likedToursSlice,
       booking:bookingReducer,
       reviews: reviewsReducer,
       agencyReview: agencyReviewReducer,
    }
})

export default store;
