import React, {useLayoutEffect, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '~/components/Background';
import {Container, ProvidersList, Provider, Avatar, Name} from './styles';
import api from '~/services/api';

export default function SelectProvider({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Dashoard');
          }}>
          <Icon name="chevron-left" size={20} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('providers');

      setProviders(response.data);
    }
    loadProviders();
  }, []);

  return (
    <Background>
      <Container>
        <ProvidersList
          data={providers}
          keyExtrator={(provider) => String(provider.id)}
          renderItem={({item: provider}) => (
            <Provider
              onPress={() =>
                navigation.navigate('SelecetDateTime', {provider})
              }>
              <Avatar
                source={{
                  uri: provider.avatar
                    ? provider.avatar.url.replace('localhost', '10.0.2.2')
                    : `https://api.adorable.io/avatar/50/${provider.name}.png`,
                }}
              />
              <Name>{provider.name}</Name>
            </Provider>
          )}
        />
      </Container>
    </Background>
  );
}
