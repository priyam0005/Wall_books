import { RouteOff } from 'lucide-react';
import { combineReducers } from 'redux';

import login, { loginUser } from './Authstore/login';
import userProfile from './profile';

import User from './userProfile/getProfile';
import MyProfile from './userProfile/MyProfile';
import Myconnet from './userProfile/connect';
import connectV from './NotiFicationStore/ReqList';
import friends from './Friends/friends';
import dost from './Friends/newFriend';
import feed from './thoughts/getThought';
import create from './thoughts/createThought';
import myThought from './thoughts/mythought';
import delThought from '../store/thoughts/deleteThought';
import upddateThought from '../store/thoughts/updateThought';
import like from '../store/thoughts/likeThought';

const rootReducer = combineReducers({
  just: login,
  flex: userProfile,
  Profile: User,
  lizzie: MyProfile,
  connect: Myconnet,
  ReqList: connectV,
  dost: friends,
  mitra: dost,
  Iliana: feed,
  Mi: myThought,
  Amore: create,
  Aurelius: delThought,
  Plato: upddateThought,
  socrates: like,
});

export default rootReducer;
