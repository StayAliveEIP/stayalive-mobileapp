import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import fetchMock from 'jest-fetch-mock'
import AlertStatusPage from './AlertStatusPage'
import {} from '@react-native-community/geolocation'

fetchMock.enableMocks()

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

jest.mock('@react-native-community/geolocation', () => ({
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  Geolocation: jest.fn(),
}))

const mockNavigate = jest.fn()
const mockNavigation = { push: mockNavigate }

describe('SettingsPage', () => {
  fetchMock.resetMocks()
  jest.clearAllMocks()

  it('renders correctly', () => {
    const { getByTestId } = render(
      <AlertStatusPage
        navigation={mockNavigation}
        route={{ params: { dataAlert: {} } }}
      />
    )
    const statusText = getByTestId('status-text')
    expect(statusText).toBeTruthy()
    expect(statusText.props.children).toBe('En attente de réponse ...')
  })

  it('calls RefuseAlert when "Refuser" button is pressed', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const { getByText } = render(
      <AlertStatusPage
        navigation={mockNavigation}
        route={{ params: { dataAlert: {} } }}
      />
    )
    const refuseButton = getByText('Refuser')
    fireEvent.press(refuseButton)
    expect(consoleLogSpy).toHaveBeenCalledWith('You refuse the alert !')
    consoleLogSpy.mockRestore()
  })

  it('calls AcceptAlert when "Accepter" button is pressed', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const { getByText } = render(
      <AlertStatusPage
        navigation={mockNavigation}
        route={{ params: { dataAlert: {} } }}
      />
    )
    const acceptButton = getByText('Accepter')
    fireEvent.press(acceptButton)
    expect(consoleLogSpy).toHaveBeenCalledWith('You accept the alert !')
    consoleLogSpy.mockRestore()
  })

  it('navigates to ProfilePage when "ProfileBadge" is pressed', () => {
    const { getByTestId } = render(
      <AlertStatusPage
        navigation={mockNavigation}
        route={{ params: { dataAlert: {} } }}
      />
    )
    const profileBadge = getByTestId('profile-badge-image')
    fireEvent.press(profileBadge)
    expect(mockNavigate).toHaveBeenCalledWith('ProfilePage')
  })
})
