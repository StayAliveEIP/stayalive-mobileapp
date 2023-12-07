import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPasswordPage from './ForgotPasswordPage';

jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))

describe('ForgotPasswordPage', () => {
  it('renders without crashing', () => {
    render(<ForgotPasswordPage navigation={{}} />);
  });

  it('displays the logo', () => {
    const { getByTestId } = render(<ForgotPasswordPage navigation={{}} />);
    const logo = getByTestId('forgot-password-logo');
    expect(logo).toBeTruthy();
  });

  it('displays the title', () => {
    const { getByText } = render(<ForgotPasswordPage navigation={{}} />);
    const title = getByText('Mot de passe oublié ?');
    expect(title).toBeTruthy();
  });

  it('displays the description', () => {
    const { getByText } = render(<ForgotPasswordPage navigation={{}} />);
    const description = getByText("Vous avez oublié votre mot de passe ?");
    expect(description).toBeTruthy();
  });

  it('displays an email input field', () => {
    const { getByTestId } = render(<ForgotPasswordPage navigation={{}} />);
    const emailInput = getByTestId('forgotpass-email-input');
    expect(emailInput).toBeTruthy();
  });

  it('displays a button to send the reset password request', () => {
    const { getByTestId } = render(<ForgotPasswordPage navigation={{}} />);
    const resetButton = getByTestId('login-button');
    expect(resetButton).toBeTruthy();
  });
});
