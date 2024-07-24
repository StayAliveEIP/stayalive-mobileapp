import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import SettingsPage from './SettingsPage'

describe('SettingsPage', () => {
  test('should call navigation.goBack when left arrow button is pressed', () => {
    const navigationMock = {
      goBack: jest.fn(),
    }

    const { getByTestId } = render(<SettingsPage navigation={navigationMock} />)

    const leftArrowButton = getByTestId('button-left-arrow')
    fireEvent.press(leftArrowButton)

    expect(navigationMock.goBack).toHaveBeenCalled()
  })

  // Add more tests as needed
})
