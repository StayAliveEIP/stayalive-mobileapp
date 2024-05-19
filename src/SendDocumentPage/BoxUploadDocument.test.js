import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { BoxUploadDocument } from './BoxUploadDocument'
import DocumentPicker from 'react-native-document-picker'

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: {
    allFiles: 'allFiles',
  },
}))

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

describe('BoxUploadDocument', () => {
  it('Select a document with success', async () => {
    const mockFile = { name: 'testFile.pdf' }
    DocumentPicker.pick.mockResolvedValueOnce([mockFile])
    const onFileSelectMock = jest.fn()

    const { getByTestId } = render(
      <BoxUploadDocument
        id="ID_CARD"
        title="Test Title"
        description="Test Description"
        onFileSelect={onFileSelectMock}
      />
    )

    fireEvent.press(getByTestId('selectDocument-button-ID_CARD'))

    await waitFor(() =>
      expect(onFileSelectMock).toHaveBeenCalledWith('ID_CARD', mockFile)
    )
  })

  it('Display the file for uploading a document', async () => {
    const mockFile = {
      name: 'testFileNameThatIsLongerThanTwentyCharacters.pdf',
    }
    DocumentPicker.pick.mockResolvedValueOnce([mockFile])

    const { getByTestId } = render(
      <BoxUploadDocument
        id="RESCUER_CERTIFICATE"
        title="Test Title"
        description="Test Description"
        onFileSelect={() => {}}
      />
    )

    fireEvent.press(getByTestId('selectDocument-button-RESCUER_CERTIFICATE'))

    await waitFor(() => {
      const button = getByTestId('selectDocument-button-RESCUER_CERTIFICATE')
      expect(button.props.children).toContain('testFileNameThatIsLo...')
    })
  })
})
