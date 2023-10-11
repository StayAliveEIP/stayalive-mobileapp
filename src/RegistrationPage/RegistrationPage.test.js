import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react-native';
import RegistrationPage from './RegistrationPage';
import fetch from 'node-fetch';
import {wait} from "@testing-library/react-native/build/user-event/utils";

jest.mock('node-fetch');
jest.mock('react-native-snackbar', () => ({
    show: jest.fn(),
}));

afterEach(cleanup);
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
        fireEvent.press(joinUsButton);

        await wait(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://api.stayalive.fr:3000/auth/register',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: 'john.doe@example.com',
                        firstname: 'John',
                        lastname: 'Doe',
                        password: 'password123',
                        phone: '(+33) 09 08 07 06 05',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        });
    });
    it('Should handle a successful registration', async () => {
        const { getByTestId } = render(<RegistrationPage />);
        const joinUsButton = getByTestId('joinUs-button');
        const checkbox = getByTestId('checkboxCGUV');

        const namesInput = getByTestId('names-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const phoneInput = getByTestId('phone-input');

        fireEvent.changeText(namesInput, 'John Doe');
        fireEvent.changeText(emailInput, 'john.doe@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(phoneInput, '(+33) 09 08 07 06 05');
        fireEvent(checkbox, 'valueChange', true);
        fireEvent.press(joinUsButton);

        await wait(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://api.stayalive.fr:3000/auth/register',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: 'john.doe@example.com',
                        firstname: 'John',
                        lastname: 'Doe',
                        password: 'password123',
                        phone: '(+33) 09 08 07 06 05',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        });

        fetch.mockResolvedValueOnce({ status: 200 });

        await wait(() => {
            expect(Snackbar.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'Message de réussite',
                    textColor: 'green',
                })
            );
        });
    });

    it('Should handle a failed registration', async () => {
        const { getByTestId } = render(<RegistrationPage />);
        const joinUsButton = getByTestId('joinUs-button');
        const checkbox = getByTestId('checkboxCGUV');
        const namesInput = getByTestId('names-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const phoneInput = getByTestId('phone-input');

        fireEvent.changeText(namesInput, 'John Doe');
        fireEvent.changeText(emailInput, 'john.doe@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(phoneInput, '(+33) 09 08 07 06 05');
        fireEvent(checkbox, 'valueChange', true);
        fireEvent.press(joinUsButton);

        await wait(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://api.stayalive.fr:3000/auth/register',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: 'john.doe@example.com',
                        firstname: 'John',
                        lastname: 'Doe',
                        password: 'password123',
                        phone: '(+33) 09 08 07 06 05',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        });

        fetch.mockResolvedValueOnce({ status: 400 });

        await wait(() => {
            expect(Snackbar.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'Message d\'erreur',
                    textColor: 'red',
                })
            );
        });
    });
    it('Should show an error message when CGUV is not accepted', async () => {
        const { getByTestId } = render(<RegistrationPage />);
        const joinUsButton = getByTestId('joinUs-button');
        const namesInput = getByTestId('names-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const phoneInput = getByTestId('phone-input');

        fireEvent.changeText(namesInput, 'John Doe');
        fireEvent.changeText(emailInput, 'john.doe@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(phoneInput, '(+33) 09 08 07 06 05');
        fireEvent.press(joinUsButton);

        await wait(() => {
            expect(Snackbar.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'Vous devez accepter nos CGU et nos CGV',
                    textColor: 'red',
                })
            );
        });
    });
});


