import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RegistrationPage from './RegistrationPage';

describe('RegistrationPage', () => {
    it('renders without crashing', () => {
        render(<RegistrationPage/>);
    });

    it('updates name field correctly', () => {
        const {getByTestId} = render(<RegistrationPage/>);
        const nameInput = getByTestId('names-input');
        fireEvent.changeText(nameInput, 'John Doe');
        expect(nameInput.props.value).toBe('John Doe');
    });

    it('updates email field correctly', () => {
        const {getByTestId} = render(<RegistrationPage/>);
        const emailInput = getByTestId('email-input');
        fireEvent.changeText(emailInput, 'test@example.com');
        expect(emailInput.props.value).toBe('test@example.com');
    });

    it('updates password field correctly', () => {
        const {getByTestId} = render(<RegistrationPage/>);
        const passwordInput = getByTestId('password-input');
        fireEvent.changeText(passwordInput, 'test123');
        expect(passwordInput.props.value).toBe('test123');
    });

    it('updates phone field correctly', () => {
        const {getByTestId} = render(<RegistrationPage/>);
        const phoneInput = getByTestId('phone-input');
        fireEvent.changeText(phoneInput, '+33 09 08 07 06 05');
        expect(phoneInput.props.value).toBe('+33 09 08 07 06 05');
    });

    it(
        'should update input values and log them when "Nous rejoindre" button is clicked',
        async () => {
            const consoleLogSpy = jest.spyOn(console, 'log');
            const { getByTestId } = render(<RegistrationPage />);

            const namesInput = getByTestId('names-input');
            const emailInput = getByTestId('email-input');
            const passwordInput = getByTestId('password-input');
            const phoneInput = getByTestId('phone-input');
            const joinUsButton = getByTestId('joinUs-button');
            const checkbox = getByTestId('checkboxCGUV')

            fireEvent.changeText(namesInput, 'John Doe');
            fireEvent.changeText(emailInput, 'john.doe@example.com');
            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.changeText(phoneInput, '(+33) 09 08 07 06 05');
            fireEvent(checkbox, 'valueChange', true);

            fireEvent.press(joinUsButton);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                'John Doe',
                'john.doe@example.com',
                'password123',
                '(+33) 09 08 07 06 05',
                true
            );
            consoleLogSpy.mockRestore();
        },
    );
});
