import React from 'react';
import { urlApi } from '../Utils/Api'
const token = await AsyncStorage.getItem('userToken');
const UrlWebsocket = await `${urlApi}:3000/rescuer/ws?token=${token}`;

export const socket = io(URL);
