import React from 'react';

import {useSelector} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';

import {PageSign, PageDashBoard} from './routes';

export default function App() {
  const signed = useSelector((state) => state.auth.signed);

  return (
    <NavigationContainer>
      {!signed ? <PageSign /> : <PageDashBoard />}
    </NavigationContainer>
  );
}
