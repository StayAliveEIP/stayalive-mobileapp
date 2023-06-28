import React from 'react';
import App from './App';
import {render} from "@testing-library/react-native";

jest.mock('@react-native-firebase/auth', () => {
    return () => ({
      signInWithCredential: jest.fn(),
      GoogleAuthProvider: {
        credential: jest.fn(),
      },
    });
  });

  jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSignin: {
      configure: jest.fn(),
      signIn: jest.fn().mockResolvedValue({idToken: 'fakeToken'}),
    },
  }));

describe('RegistrationPage', () => {
    it('renders without crashing', () => {
        render(<App/>);
    });
});
