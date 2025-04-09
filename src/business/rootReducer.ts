import {combineReducers} from '@reduxjs/toolkit';
import getTokenSlice from './slices/token.slice';
import memberSlice from './slices/signIn.slice';
import mottoSlice from './slices/motto.slice';
import foodMenuSlice from './slices/food-menu.slice';
import birthDaySlice from './slices/birthday.slice';
import favoriteAppsSlice from './slices/favorite-app.slice';
import timelineSlice from './slices/timeline.slice';
import membersSlice from './slices/members.slice';
import deviceSlice from './slices/device.slice';
import helpSlice from './slices/help.slice';
import questionsSlice from './slices/questions.slice';
import feedBackSlice from './slices/feed-back.slice';
import serviceRouteSlice from './slices/serives-route.slice';
import fargotPassword from './slices/fargot-password.slice';
import changePassword from './slices/change-password.slice';
import aiSlice from './slices/ai.slice';
import newsSlice from './slices/new.slice';
import announcements from './slices/announcements.slice';
import getYearRepeatList from './slices/get-year-repeat-list';
import locationSlice from './slices/location.slice';
import popUpSlice from './slices/popup.slice';
import advertisementsSlice from './slices/advertisements.slice';
import hairdresserSlice from './slices/hairdresser.slice';

const rootReducer = combineReducers({
  getTokenSlice,
  memberSlice,
  mottoSlice,
  foodMenuSlice,
  birthDaySlice,
  favoriteAppsSlice,
  timelineSlice,
  membersSlice,
  deviceSlice,
  helpSlice,
  questionsSlice,
  feedBackSlice,
  serviceRouteSlice,
  fargotPassword,
  changePassword,
  aiSlice,
  newsSlice,
  announcements,
  getYearRepeatList,
  locationSlice,
  popUpSlice,
  advertisementsSlice,
  hairdresserSlice,
});

export default rootReducer;
