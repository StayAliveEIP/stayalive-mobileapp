import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import ForgotPasswordPage from './ForgotPasswordPage'

jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
)

const mockNavigation = {
  goBack: jest.fn(),
}

describe('ForgotPasswordPage', () => {
  it('renders without crashing', () => {
    render(<ForgotPasswordPage navigation={mockNavigation} />)
  })

  it('displays the logo', () => {
    const { getByTestId } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    const logo = getByTestId('forgot-password-logo')
    expect(logo).toBeTruthy()
  })

  it('displays the title', () => {
    const { getByText } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    const title = getByText('Mot de passe oublié ?')
    expect(title).toBeTruthy()
  })

  it('displays the description', () => {
    const { getByText } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    const description = getByText('Vous avez oublié votre mot de passe ?')
    expect(description).toBeTruthy()
  })

  it('displays an email input field', () => {
    const { getByTestId } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    const emailInput = getByTestId('forgotpass-email-input')
    expect(emailInput).toBeTruthy()
  })

  it('displays a button to send the reset password request', () => {
    const { getByTestId } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    const resetButton = getByTestId('login-button')
    expect(resetButton).toBeTruthy()
  })

  it('sends a password reset email', async () => {
    const { getByTestId } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    fireEvent.changeText(
      getByTestId('forgotpass-email-input'),
      'test@example.com'
    )
    fireEvent.press(getByTestId('login-button'))
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://api.stayalive.fr:3000/rescuer/forgot-password/link?email=test%40example.com',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    })
  })
  it('displays the back button', () => {
    const { getByTestId } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    const backButton = getByTestId('back-button')
    expect(backButton).toBeTruthy()
  })

  it('calls goBack when the back button is pressed', () => {
    const { getByTestId } = render(
      <ForgotPasswordPage navigation={mockNavigation} />
    )
    fireEvent.press(getByTestId('back-button'))
    expect(mockNavigation.goBack).toHaveBeenCalled()
  })
})
