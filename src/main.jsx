import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import App from './App.jsx';
import { CrossfadeTransition } from './transition/slide.jsx';
import { BlurTransition } from './transition/transition.jsx';
import { Provider } from 'react-redux';

import ExclusiveHomepage from './components/home.jsx';
import ClassicPostCreator from './components/CreatePost.jsx';
import Profile from './components/Profile.jsx';
import store from './store/index.js';
import Profilia from './othercomps/Profilia.jsx';

import AuthForms from './othercomps/AuthComp/signIn.jsx';
import LogIn from './othercomps/AuthComp/login.jsx';
import MessagingInterface from './othercomps/message.jsx';
import ProfileUpdateForm from './othercomps/ProfileUpdate.jsx';
import UserSearchResults from './othercomps/search.jsx';

import Friendlist from './othercomps/FriendList.jsx';

import Privatechat from './othercomps/message.jsx';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,

    children: [
      {
        path: '/',
        element: (
          <PageWrapper>
            {' '}
            <ExclusiveHomepage />
          </PageWrapper>
        ),
      },
      {
        path: '/notifications',
        element: (
          <BlurTransition>
            {' '}
            <Friendlist />
          </BlurTransition>
        ),
      },

      {
        path: '/create-post',
        element: <ClassicPostCreator />,
      },

      {
        path: '/profile',
        element: (
          <BlurTransition>
            <Profile />
          </BlurTransition>
        ),
      },
    ],
  },
  {
    path: '/sign-in',
    element: <AuthForms />,
  },
  {
    path: '/messages',
    element: (
      <PageWrapper>
        <MessagingInterface />
      </PageWrapper>
    ),
  },

  {
    path: '/Profilia',

    element: (
      <BlurTransition>
        <Profilia />
      </BlurTransition>
    ),
  },
  {
    path: '/login',
    element: <LogIn />,
  },

  {
    path: '/updateProfile',
    element: <ProfileUpdateForm />,
  },
  {
    path: '/search',
    element: (
      <PageWrapper>
        <UserSearchResults />
      </PageWrapper>
    ),
  },

  {
    path: '/PersonalChat',
    element: <Privatechat />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
