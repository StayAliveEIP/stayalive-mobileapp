import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import AccountPage from './AccountPage'
import { launchImageLibrary } from 'react-native-image-picker'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}))

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}))

describe('AccountPage', () => {
  it('renders without crashing', () => {
    render(<AccountPage />)
  })

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('calls goBack when the left arrow button is pressed', () => {
    const goBackMock = jest.fn()
    const { getByTestId } = render(
      <AccountPage navigation={{ goBack: goBackMock }} />
    )
    const leftArrowButton = getByTestId('button-left-arrow')

    fireEvent.press(leftArrowButton)

    expect(goBackMock).toHaveBeenCalledTimes(1)
  })

  it('updates avatar source on image selection', async () => {
    const { getByTestId } = render(
      <AccountPage navigation={{ goBack: jest.fn() }} />
    )
    const selectImageButton = getByTestId('select-image-button')

    launchImageLibrary.mockImplementation((options, callback) => {
      const response = { uri: 'selected-image-uri' }
      callback(response)
    })

    await act(async () => {
      fireEvent.press(selectImageButton)

      await waitFor(() => {
        expect(launchImageLibrary).toHaveBeenCalledWith(
          expect.objectContaining({
            mediaType: 'photo',
          }),
          expect.any(Function)
        )
      })
    })
  })

  it('logs cancellation message on image picker cancellation', async () => {
    const { getByTestId } = render(
      <AccountPage navigation={{ goBack: jest.fn() }} />
    )
    const selectImageButton = getByTestId('select-image-button')
    const consoleLogSpy = jest.spyOn(console, 'log')

    launchImageLibrary.mockImplementation((options, callback) => {
      const response = { didCancel: true }
      callback(response)
    })

    await act(async () => {
      fireEvent.press(selectImageButton)

      expect(consoleLogSpy).toHaveBeenCalledWith('User cancelled image picker')
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.resetMocks()
  })
})
