import React from 'react'
import SendDocumentPage from './SendDocumentPage'
import { fireEvent, render } from '@testing-library/react-native'

global.fetch = jest.fn().mockResolvedValueOnce({
  json: () =>
    Promise.resolve([
      { type: 'ID_CARD', data: null }, // Simule le cas où la réponse ne contient pas de données pour ID_CARD
      { type: 'RESCUER_CERTIFICATE', data: null }, // Simule le cas où la réponse ne contient pas de données pour RESCUER_CERTIFICATE
    ]),
})

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
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
describe('SendDocumentPage', () => {
  it('renders correctly', () => {
    const navigation = { goBack: jest.fn() }
    const { toJSON } = render(<SendDocumentPage navigation={navigation} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('calls goBack when left arrow button is pressed', () => {
    const navigation = { goBack: jest.fn() }
    const { getByTestId } = render(<SendDocumentPage navigation={navigation} />)
    fireEvent.press(getByTestId('button-left-arrow'))
    expect(navigation.goBack).toHaveBeenCalled()
  })
})
