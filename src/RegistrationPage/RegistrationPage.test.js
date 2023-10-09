import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegistrationPage from './RegistrationPage';
import fetch from 'node-fetch';

jest.mock('node-fetch');

describe('RegistrationPage', () => {
    it('renders without crashing', () => {
        render(<RegistrationPage />);
    });

    it('Updates name field correctly', () => {
        const { getByTestId } = render(<RegistrationPage />);
        const nameInput = getByTestId('names-input');
        fireEvent.changeText(nameInput, 'John Doe');
        expect(nameInput.props.value).toBe('John Doe');
    });

    it('Updates email field correctly', () => {
        const { getByTestId } = render(<RegistrationPage />);
        const emailInput = getByTestId('email-input');
        fireEvent.changeText(emailInput, 'test@example.com');
        expect(emailInput.props.value).toBe('test@example.com');
    });

    it('Updates password field correctly', () => {
        const { getByTestId } = render(<RegistrationPage />);
        const passwordInput = getByTestId('password-input');
        fireEvent.changeText(passwordInput, 'test123');
        expect(passwordInput.props.value).toBe('test123');
    });

    it('Updates phone field correctly', () => {
        const { getByTestId } = render(<RegistrationPage />);
        const phoneInput = getByTestId('phone-input');
        fireEvent.changeText(phoneInput, '+33 09 08 07 06 05');
        expect(phoneInput.props.value).toBe('+33 09 08 07 06 05');
    });

    it('Should update input values and log them when "Nous rejoindre" button is clicked', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<RegistrationPage />);

        const namesInput = getByTestId('names-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const phoneInput = getByTestId('phone-input');
        const joinUsButton = getByTestId('joinUs-button');
        const checkbox = getByTestId('checkboxCGUV');

        fireEvent.changeText(namesInput, 'John Doe');
        fireEvent.changeText(emailInput, 'john.doe@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(phoneInput, '(+33) 09 08 07 06 05');
        fireEvent(checkbox, 'valueChange', true);

        fireEvent.press(joinUsButton);

        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async operation

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'John Doe',
            'john.doe@example.com',
            'password123',
            '(+33) 09 08 07 06 05',
            true
        );
        consoleLogSpy.mockRestore();
    });

    it('Should do the Registration request and get a success status', async () => {
        const { getByTestId } = render(<RegistrationPage />);

        const namesInput = getByTestId('names-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const phoneInput = getByTestId('phone-input');
        const joinUsButton = getByTestId('joinUs-button');
        const checkbox = getByTestId('checkboxCGUV');

        fireEvent.changeText(namesInput, 'John Doe');
        fireEvent.changeText(emailInput, 'john.doe@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(phoneInput, '(+33) 09 08 07 06 05');
        fireEvent(checkbox, 'valueChange', true);

        await fetch.mockResolvedValueOnce({ status: 200 });

        fireEvent.press(joinUsButton);

        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async operation

        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify({
                names: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '(+33) 09 08 07 06 05',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
