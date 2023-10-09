import React from 'react';
import App from './App';
import {render} from "@testing-library/react-native";

jest.mock('react-native-snackbar', () => ({
    show: jest.fn(),
}));
describe('RegistrationPage', () => {
    it('renders without crashing', () => {
        render(<App/>);
    });
});
