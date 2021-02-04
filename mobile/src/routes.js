import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashoard from './pages/Dashoard';
import Profile from './pages/Profile';

import SelectProvider from './pages/New/SelectProvider';
import SelecetDateTime from './pages/New/SelectDateTime';
import Confirm from './pages/New/Confirm';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PageAddNewPrestador() {
  return (
    <Stack.Navigator
      initialRouteName="SelectProvider"
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#FFF',
        headerTitleAlign: 'center',
        headerLeftContainerStyle: {
          marginLeft: 20,
        },
      }}>
      <Stack.Screen
        options={{
          title: 'Selecione o Prestador',
        }}
        name="SelectProvider"
        component={SelectProvider}
      />
      <Stack.Screen
        options={{
          title: 'Selecione o horário',
        }}
        name="SelecetDateTime"
        component={SelecetDateTime}
      />
      <Stack.Screen
        options={{
          title: 'Confirmar agendamento',
        }}
        name="Confirm"
        component={Confirm}
      />
    </Stack.Navigator>
  );
}

// Tive que fazer diferente da video aula pelo meu react navigation ser mais atualizado
export function PageSign() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="SignIn"
        component={SignIn}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SignUp"
        component={SignUp}
      />
    </Stack.Navigator>
  );
}
export function PageDashBoard({navigation}) {
  return (
    <Tab.Navigator
      blur
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Dashoard') {
            iconName = focused ? 'event' : 'event';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
          } else if (route.name === 'Agendar') {
            iconName = focused ? 'add-circle-outline' : 'add-circle-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: '#fff',
        inactiveTintColor: 'rgba(255,255,255,0.6)',
        style: {
          backgroundColor: '#33adff',
        },
      }}>
      <Tab.Screen name="Dashoard" component={Dashoard} />
      <Tab.Screen
        options={{tabBarVisible: false}}
        name="Agendar"
        component={PageAddNewPrestador}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
