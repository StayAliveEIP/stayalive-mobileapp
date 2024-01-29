import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import fetchMock from 'jest-fetch-mock'
import { Alert } from 'react-native'
import LoginPage from './LoginPage'
import { urlApi } from '../Utils/Api'

fetchMock.enableMocks()

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

const mockNavigate = jest.fn()
const mockNavigation = {
  navigate: mockNavigate,
}

describe('LoginPage', () => {
  afterEach(() => {
    fetchMock.resetMocks()
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<LoginPage navigation={mockNavigation} />)
  })

  it('Updates email field correctly', () => {
    const { getByTestId } = render(<LoginPage navigation={mockNavigation} />)
    const emailInput = getByTestId('login-email-input')

    fireEvent.changeText(emailInput, 'spam.noelvarga25@gmail.com')
    expect(emailInput.props.value).toBe('spam.noelvarga25@gmail.com')
  })

  it('Updates password field correctly', () => {
    const { getByTestId } = render(<LoginPage navigation={mockNavigation} />)
    const passwordInput = getByTestId('login-password-input')

    fireEvent.changeText(passwordInput, 'nono2504')
    expect(passwordInput.props.value).toBe('nono2504')
  })

  it('Handles login button click with success', async () => {
    fetchMock.mockOnce(JSON.stringify({ accessToken: 'SomeAccessToken' }), {
      status: 200,
    })

    const { getByTestId } = render(<LoginPage navigation={mockNavigation} />)
    const emailInput = getByTestId('login-email-input')
    const passwordInput = getByTestId('login-password-input')
    const loginButton = getByTestId('login-button')

    fireEvent.changeText(emailInput, 'spam.noelvarga25@gmail.com')
    fireEvent.changeText(passwordInput, 'nono2504')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${urlApi}/rescuer/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'spam.noelvarga25@gmail.com',
          password: 'nono2504',
        }),
      })
    })
  })

  it('Handles login button click with failure', async () => {
    fetchMock.mockOnce('', { status: 400 })

    const { getByTestId } = render(<LoginPage navigation={mockNavigation} />)
    const emailInput = getByTestId('login-email-input')
    const passwordInput = getByTestId('login-password-input')
    const loginButton = getByTestId('login-button')

    fireEvent.changeText(emailInput, 'spam.noelvarga25@gmail.com')
    fireEvent.changeText(passwordInput, 'wrong_password')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${urlApi}/rescuer/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'spam.noelvarga25@gmail.com',
          password: 'wrong_password',
        }),
      })
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Nous ne parvenons pas à contacter nos serveurs'
      )
    })
  })
})
