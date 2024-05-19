import React from 'react'
import App from './App'
import { render } from '@testing-library/react-native'

jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn(),
  createChannel: jest.fn(),
  displayNotification: jest.fn(),
  onBackgroundEvent: jest.fn(),
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

jest.mock('@react-native-community/geolocation', () => {
  return {
    watchPosition: jest.fn(),
    getCurrentPosition: jest.fn(),
    clearWatch: jest.fn(),
  }
})
jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))
jest.mock('react-native-document-picker', () => ({
  pick: async () => [
    {
      name: 'testFile.pdf',
      type: 'application/pdf',
    },
  ],
  isCancel: jest.fn(),
}))
describe('RegistrationPage', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
