import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ProfilePage from './ProfilePage'

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
const mockNavigation = { navigate: mockNavigate }

describe('ProfilePage', () => {
  it('displays user name', () => {
    const { getByTestId } = render(<ProfilePage navigation={mockNavigation} />)
    const userName = getByTestId('user-name')
    expect(userName).toBeTruthy()
    expect(userName.props.children).toBe('Louis AUTEF')
  })

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
    expect(consoleLogSpy).toHaveBeenCalledWith('disconnect button press !')
    consoleLogSpy.mockRestore()
  })

  it('updates avatarSource when selectImage is called', () => {
    const { getByTestId } = render(<ProfilePage navigation={mockNavigation} />)
    const selectImageButton = getByTestId('select-image-button')

    fireEvent.press(selectImageButton)

    const avatarSource = getByTestId('user-avatar').props.source
    expect(avatarSource).not.toBeNull()
  })
})
