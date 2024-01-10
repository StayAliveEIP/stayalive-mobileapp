import React from 'react';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestUpdateEmail = async (profileData, token) => {
  const body = JSON.stringify({
    "email": profileData["email"]["email"]
  })
  const response = await fetch('http://api.stayalive.fr:3000/rescuer/account/change-email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const responseData = await response.json();

  if (response.status === 200 || response.status === 201) {
    return true;
  } else {
    return false;
  }
}

export const requestUpdatePhone = async (profileData, token) => {
  const body = JSON.stringify({
    "phone": profileData["phone"]["phone"]
  })
  const response = await fetch('http://api.stayalive.fr:3000/rescuer/account/change-phone', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const responseData = await response.json();

  if (response.status === 200 || response.status === 201) {
    return true;
  } else {
    return false;
  }
}

