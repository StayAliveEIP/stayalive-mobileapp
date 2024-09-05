import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import UnavailableAvailablePage from './UnavailableAvailablePage'
import fetchMock from 'jest-fetch-mock'

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('mockToken'),
}))

const navigationMock = { navigate: jest.fn() }

fetchMock.enableMocks()

describe('UnavailableAvailablePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const { getByTestId } = render(
      <UnavailableAvailablePage navigation={navigationMock} />
    )
    expect(getByTestId('main-view')).toBeDefined()
    expect(getByTestId('profile-badge')).toBeDefined()
    expect(getByTestId('status-text')).toBeDefined()
    expect(getByTestId('status-indisponible')).toBeDefined()
    expect(getByTestId('unavailable-logo')).toBeDefined()
    expect(getByTestId('warning-view')).toBeDefined()
    expect(getByTestId('warning-logo')).toBeDefined()
    expect(getByTestId('warning-title')).toBeDefined()
    expect(getByTestId('warning-text')).toBeDefined()
  })

  it('navigates to ProfilePage when profile badge is clicked', () => {
    const { getByTestId } = render(
      <UnavailableAvailablePage navigation={navigationMock} />
    )
    fireEvent.press(getByTestId('profile-badge'))
    expect(navigationMock.navigate).toHaveBeenCalledWith('ProfilePage')
  })

  it('updates status and navigates to AvailablePage when available button is clicked', async () => {
    // Mock pour console.log
    const consoleSpy = jest.spyOn(console, 'log')

    const { getByTestId } = render(
      <UnavailableAvailablePage navigation={navigationMock} />
    )
    fireEvent.press(getByTestId('available-button'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Vérifie que console.log a été appelé avec le message attendu
    expect(consoleSpy).toHaveBeenCalledWith('Status updated successfully!')

    // Assurez-vous de nettoyer le mock après le test
    consoleSpy.mockRestore()
  })
})
