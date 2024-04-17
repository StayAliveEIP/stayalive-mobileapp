import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import BoxDocument from './BoxDocument'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
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

const mockProps = {
  id: 'documentID',
  title: 'Document Title',
  data: { key1: 'value1', key2: 'value2', size: 1024 },
  setData: jest.fn(),
  type: 'document',
}

describe('<BoxDocument />', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<BoxDocument {...mockProps} />)
    expect(getByText('Document Title')).toBeTruthy()
    expect(getByTestId('delete-document-button')).toBeTruthy()
    expect(getByTestId('download-document-button')).toBeTruthy()
  })

  it('calls handleDeleteDocument when delete button is pressed', () => {
    const { getByTestId } = render(<BoxDocument {...mockProps} />)
    fireEvent.press(getByTestId('delete-document-button'))
    expect(mockProps.setData).not.toHaveBeenCalled()
  })

  it('calls handleDownloadDocument when download button is pressed', () => {
    const { getByTestId } = render(<BoxDocument {...mockProps} />)
    fireEvent.press(getByTestId('download-document-button'))
    expect(mockProps.setData).toHaveBeenCalled()
  })
})
