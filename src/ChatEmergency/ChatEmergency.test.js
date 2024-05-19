import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import ChatEmergency from './ChatEmergency'
import AsyncStorage from '@react-native-async-storage/async-storage'
import fetchMock from 'jest-fetch-mock'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}))

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon')
jest.mock('react-native-paper', () => ({
  Appbar: {
    Header: 'Appbar.Header',
    Content: 'Appbar.Content',
  },
}))

fetchMock.enableMocks()

describe('ChatEmergency Component', () => {
  const mockNavigation = { goBack: jest.fn() }
  const mockRoute = { params: { rescuerId: '1', emergencyId: '123' } }

  beforeEach(() => {
    fetch.resetMocks()
    jest.clearAllMocks()
  })

  it('renders correctly and shows loading indicator initially', async () => {
    fetch.mockResponseOnce(
      JSON.stringify([{ _id: 'conv123', emergencyId: '123' }])
    )

    AsyncStorage.getItem.mockResolvedValue('token')

    const { getByTestId } = render(
      <ChatEmergency navigation={mockNavigation} route={mockRoute} />
    )

    expect(getByTestId('loader')).toBeTruthy()
    await waitFor(() => {
      expect(getByTestId('chatContainer')).toBeTruthy()
    })
  })
})
