import React from 'react';
import App from './App';
import {render} from "@testing-library/react-native";

jest.mock('@react-native-community/geolocation', () => {
    return {
        getCurrentPosition: jest.fn(),
    };
});
jest.mock('react-native-snackbar', () => ({
    show: jest.fn(),
}));
jest.mock(
    'react-native-document-picker', () => ({
    pick: async () => [
        {
            name: 'testFile.pdf',
            type: 'application/pdf',
        },
    ],
    isCancel: jest.fn(),
}));
describe('RegistrationPage', () => {
    it('renders without crashing', () => {
        render(<App/>);
    });
});
