import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect'
import RescueHistoryPage from './RescueHistoryPage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { urlApi } from '../../Utils/Api'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}))

jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))

jest.mock('node-fetch')

describe('RescueHistoryPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })
  it('renders correctly', () => {
    const { getByTestId } = render(
      <RescueHistoryPage rescueNumber={2} navigation={{}} />
    )

    expect(getByTestId('user-name')).toBeDefined()
    expect(getByTestId('button-left-arrow')).toBeDefined()
  })

  it('renders no rescues message when rescueNumber is 0', () => {
    const { queryByTestId } = render(
      <RescueHistoryPage rescueNumber={0} navigation={{}} />
    )
    expect(queryByTestId('no-rescues-message')).toBeDefined()
  })

  it('handles click on back arrow', () => {
    const goBack = jest.fn()

    const { getByTestId } = render(
      <RescueHistoryPage navigation={{ goBack }} />
    )

    const backButton = getByTestId('button-left-arrow')
    fireEvent.press(backButton)

    expect(goBack).toHaveBeenCalled()
  })

  it('fetches profile data and rescue history data on component mount', async () => {
    const mockProfileData = {
      firstname: 'John',
      lastname: 'Doe',
    }

    const mockRescueData = [
      {
        id: '1',
        info: 'Mock rescue info 1',
        address: 'Mock rescue address 1',
        status: 'Mock rescue status 1',
      },
      {
        id: '2',
        info: 'Mock rescue info 2',
        address: 'Mock rescue address 2',
        status: 'Mock rescue status 2',
      },
    ]

    AsyncStorage.getItem.mockResolvedValue('mockToken')
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData,
    })
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRescueData,
    })

    render(<RescueHistoryPage navigation={{}} />)

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userToken')
      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        `${urlApi}/rescuer/account`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer mockToken',
          },
        }
      )
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        `${urlApi}/rescuer/emergency/history`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer mockToken',
          },
        }
      )
    })
  })
})
