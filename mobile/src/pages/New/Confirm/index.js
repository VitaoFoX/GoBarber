import React, {useLayoutEffect, useMemo} from 'react';
import {TouchableOpacity} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {formatRelative, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';

import {Container, Avatar, Name, Time, SubmitButton} from './styles.js';
import api from '~/services/api';

export default function Confirm({navigation, route}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const {provider} = route.params;
  const {time} = route.params;

  const dateFormatted = useMemo(
    () => formatRelative(parseISO(time), new Date(), {locale: pt}),
    [time],
  );

  async function handleAddAppointment() {
    await api.post('appointments', {
      provider_id: provider.id,
      date: time,
    });
    navigation.navigate('Dashoard');
    // Para resetar a rota
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'SelectProvider',
          },
          {name: 'SelectProvider'},
        ],
      }),
    );
  }

  return (
    <Background>
      <Container>
        <Avatar
          source={{
            uri: provider.avatar
              ? provider.avatar.url.replace('localhost', '10.0.2.2')
              : `https://api.adorable.io/avatar/50/${provider.name}.png`,
          }}
        />
        <Name>{provider.name}</Name>
        <Time>{dateFormatted}</Time>
        <SubmitButton onPress={handleAddAppointment}>
          Confirmar Agendamento
        </SubmitButton>
      </Container>
    </Background>
  );
}
