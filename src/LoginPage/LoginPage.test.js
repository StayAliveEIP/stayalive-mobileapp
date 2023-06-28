import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginPage from './LoginPage';

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

describe('LoginPage', () => {
    it('renders without crashing', () => {
        render(<LoginPage />);
    });

    it('updates email field correctly', () => {
        const { getByTestId } = render(<LoginPage />);
        const emailInput = getByTestId('login-email-input');
        fireEvent.changeText(emailInput, 'john.doe@example.com');
        expect(emailInput.props.value).toBe('john.doe@example.com');
    });

    it('updates password field correctly', () => {
        const { getByTestId } = render(<LoginPage />);
        const passwordInput = getByTestId('login-password-input');
        fireEvent.changeText(passwordInput, 'password123');
        expect(passwordInput.props.value).toBe('password123');
    });

    it('should log email and password when "Se connecter" button is clicked', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<LoginPage />);

        const emailInput = getByTestId('login-email-input');
        const passwordInput = getByTestId('login-password-input');
        const loginButton = getByTestId('login-button');

        fireEvent.changeText(emailInput, 'john.doe@example.com');
        fireEvent.changeText(passwordInput, 'password123');

        fireEvent.press(loginButton);

        expect(consoleLogSpy).toHaveBeenCalledWith('john.doe@example.com', 'password123');
        consoleLogSpy.mockRestore();
    });

    it('should log "Join !" when "Nous rejoindre" button is clicked', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<LoginPage />);

        const joinButton = getByTestId('join-button');

        fireEvent.press(joinButton);

        expect(consoleLogSpy).toHaveBeenCalledWith('Join !');
        consoleLogSpy.mockRestore();
    });
});
