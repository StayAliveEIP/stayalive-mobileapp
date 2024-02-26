import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ProfilePage from './ProfilePage'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: (options, callback) => {
    const response = { uri: 'image-uri' }
    callback(response)
  },
  launchCamera: (options, callback) => {
    const response = { uri: 'image-uri' }
    callback(response)
  },
}))

const mockNavigate = jest.fn()
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn() }

describe('ProfilePage', () => {
  it('clicks the left arrow button', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const { getByTestId } = render(<ProfilePage navigation={mockNavigation} />)
    const leftArrowButton = getByTestId('button-left-arrow')
    fireEvent.press(leftArrowButton)
    expect(consoleLogSpy).toHaveBeenCalledWith('arrow left clicked !')
    consoleLogSpy.mockRestore()
  })

  it('clicks the disconnect button', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const { getByTestId } = render(<ProfilePage navigation={mockNavigation} />)
    const disconnectButton = getByTestId('button-disconnect')
    fireEvent.press(disconnectButton)
    expect(consoleLogSpy).toHaveBeenCalledWith('Disconnect button press !')
    consoleLogSpy.mockRestore()
  })
  
})
