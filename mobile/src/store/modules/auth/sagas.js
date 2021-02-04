import {Alert} from 'react-native';
import {takeLatest, call, put, all} from 'redux-saga/effects';

import {signInSuccess, signFailure} from './actions';

import api from '~/services/api';

export function* signIn({payload}) {
  try {
    console.tron.log('oi');

    const {email, password} = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const {token, user} = response.data;

    if (user.provider) {
      Alert.alert(
        'Erro no login',
        'O usuário não pode ser prestador de serviços',
      );
    }

    // Inserindo o header das proximas requisições
    api.defaults.headers.Authorization = `Bearer ${token}`;

    // yield delay(3000);

    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert('Erro no login', 'Falha na autenticação, verifique seus dados');
    yield put(signFailure());
  }
}

export function* signUp({payload}) {
  try {
    const {name, email, password} = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    // history.push('/');
  } catch (err) {
    Alert.alert('Erro no login', 'Falha no cadastro, verifique seus dados!');
    yield put(signFailure());
  }
}

export function setToken({payload}) {
  if (!payload) return;
  const {token} = payload.auth;

  if (token) {
    // Inserindo o header das proximas requisições
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}
export function signOut() {
  // history.push('/');
}

// 'persist/REHYDRATE' ouvindo do persistem e colocando o token
// all([takeLatest]) ouve uma action e faz o processo que tem que ser feito
export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
