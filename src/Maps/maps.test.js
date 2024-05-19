import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import Maps from './maps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import fetchMock from 'jest-fetch-mock'
import { urlApi } from '../Utils/Api'
import Geolocation from '@react-native-community/geolocation'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock('@react-native-community/geolocation', () => ({
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}))

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon')
jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))
jest.mock('react-native-maps-directions', () => 'MapViewDirections')

fetchMock.enableMocks()

describe('Maps Component', () => {
  const mockNavigation = { navigate: jest.fn() }
  const mockRoute = {
    params: {
      data: {
        emergency: { id: '123', position: { latitude: 0, longitude: 0 } },
      },
    },
  }

  beforeEach(() => {
    fetch.resetMocks()
    jest.clearAllMocks()
  })

  it('renders correctly and fetches walking duration', async () => {
    AsyncStorage.getItem.mockResolvedValue('token')

    const responseData = {
      routes: [
        {
          legs: [
            {
              duration: { text: '30 mins' },
            },
          ],
        },
      ],
    }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(responseData),
    })

    const consoleSpy = jest.spyOn(console, 'log')

    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    }

    Geolocation.watchPosition.mockImplementationOnce((success) => {
      success(mockPosition)
    })

    render(<Maps navigation={mockNavigation} route={mockRoute} />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Walking duration:', '30 mins')
    })

    consoleSpy.mockRestore()
  })

  it('navigates to chat emergency on chat button press', async () => {
    AsyncStorage.getItem.mockResolvedValue('userId')

    const { getByTestId } = render(
      <Maps navigation={mockNavigation} route={mockRoute} />
    )

    fireEvent.press(getByTestId('chatButton'))

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ChatEmergency', {
        rescuerId: 'userId',
        emergencyId: '123',
      })
    })
  })

  it('ends emergency on end button press', async () => {
    AsyncStorage.getItem.mockResolvedValue('token')

    fetchMock.mockResolvedValueOnce({
      ok: true,
    })

    const { getByText } = render(
      <Maps navigation={mockNavigation} route={mockRoute} />
    )

    fireEvent.press(getByText("Fin de l'intervention"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        `${urlApi}/rescuer/emergency/terminate?id=123`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer token',
          },
        }
      )
    })

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AvailablePage')
    })
  })
})
