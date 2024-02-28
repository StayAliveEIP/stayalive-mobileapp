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

const mockNavigate = jest.fn()
const mockNavigation = { navigate: mockNavigate, goBack: jest.fn() }

describe('SendDocumentPage', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <SendDocumentPage navigation={mockNavigation} />
    )
    const logo = getByTestId('document-logo')
    expect(logo).toBeTruthy()
    expect(getByText('Envoyer mes documents')).toBeTruthy()
  })

  it('displays "Télécharger mon document" when no file is selected', () => {
    const { getByTestId } = render(
      <SendDocumentPage navigation={mockNavigation} />
    )
    const button = getByTestId('selectDocument-button-documentID')
    expect(button).toBeTruthy()

    const buttonText = button.props.children

    expect(buttonText).toBe('Télécharger mon document')
  })

  it('renders two BoxDocuments with specific ids', () => {
    const { getByTestId } = render(
      <SendDocumentPage navigation={mockNavigation} />
    )

    const documentIDBox = getByTestId('selectDocument-button-documentID')
    const documentSauveteurBox = getByTestId(
      'selectDocument-button-documentSauveteur'
    )

    expect(documentIDBox).toBeTruthy()
    expect(documentSauveteurBox).toBeTruthy()
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

  it('renders the "Envoyer vos documents" button', () => {
    const { getByText } = render(
      <SendDocumentPage navigation={mockNavigation} />
    )
    const button = getByText('Envoyer vos documents')
    expect(button).toBeTruthy()
  })
})
