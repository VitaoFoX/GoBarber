import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';

import './config/ReactotronConfig';
import {store, persistor} from './store';
import App from './App';

// options={{headerShown: false}} tira o header
function Index() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar barStyle="light-content" backgroundColor="#00ace6" />
        <App />
      </PersistGate>
    </Provider>
  );
}

export default Index;