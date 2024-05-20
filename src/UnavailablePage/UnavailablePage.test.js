import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import UnavailablePage from './UnavailablePage'
import fetchMock from 'jest-fetch-mock'

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('mockToken'),
}))

const navigationMock = { navigate: jest.fn() }

fetchMock.enableMocks()

describe('UnavailablePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const { getByTestId } = render(
      <UnavailablePage navigation={navigationMock} />
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
    expect(getByTestId('available-button')).toBeDefined()
    expect(getByTestId('available-button-text')).toBeDefined()
  })

  it('navigates to ProfilePage when profile badge is clicked', () => {
    const { getByTestId } = render(
      <UnavailablePage navigation={navigationMock} />
    )
    fireEvent.press(getByTestId('profile-badge'))
    expect(navigationMock.navigate).toHaveBeenCalledWith('ProfilePage')
  })

  it('updates status and navigates to AvailablePage when available button is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log')

    const { getByTestId } = render(
      <UnavailablePage navigation={navigationMock} />
    )
    fireEvent.press(getByTestId('available-button'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
    expect(consoleSpy).toHaveBeenCalledWith('Status updated !')
    consoleSpy.mockRestore()
    expect(navigationMock.navigate).toHaveBeenCalledWith('AvailablePage')
  })
})
