import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import SendDocumentPage from './SendDocumentPage'

jest.mock('react-native-document-picker', () => ({
  DocumentPicker: {
    types: {
      allFiles: 'public.content',
    },
    pick: async () => ({
      uri: 'mocked_file_uri',
      name: 'mocked_file_name',
      type: 'mocked_file_type',
    }),
  },
}))

jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))

jest.mock('rn-fetch-blob', () => ({
  fetch: jest.fn(),
  fs: {
    dirs: {
      DocumentDir: jest.fn(),
    },
    exists: jest.fn(),
    writeFile: jest.fn(),
  },
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

const mockNavigate = jest.fn()
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn() }

describe('SendDocumentPage', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <SendDocumentPage navigation={mockNavigation} />
    )
    const logo = getByTestId('document-logo')
    expect(logo).toBeTruthy()
  })

  it('clicks the left arrow button', () => {
    const consoleLogSpy = jest.spyOn(console, 'log')
    const { getByTestId } = render(
      <SendDocumentPage navigation={mockNavigation} />
    )
    const leftArrowButton = getByTestId('button-left-arrow')
    fireEvent.press(leftArrowButton)
    expect(consoleLogSpy).toHaveBeenCalledWith('arrow left clicked !')
    consoleLogSpy.mockRestore()
  })
})
