import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import SendDocumentPage from './SendDocumentPage';
import { BoxDocument } from './SendDocumentPage';

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
}));

describe('SendDocumentPage', () => {
    it('renders correctly', () => {
        const { getByText } = render(<SendDocumentPage />);
        expect(getByText('Envoyer mes documents')).toBeTruthy();
    });

    it('displays "Télécharger mon document" when no file is selected', () => {
        const { getByTestId } = render(<SendDocumentPage />);
        const button = getByTestId('selectDocument-button-documentID');
        expect(button).toBeTruthy();

        const buttonText = button.props.children;

        expect(buttonText).toBe('Télécharger mon document');
    });

    it('clicks the left arrow button', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<SendDocumentPage />);
        const leftArrowButton = getByTestId('button-left-arrow');
        fireEvent.press(leftArrowButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('arrow left clicked !');
        consoleLogSpy.mockRestore();
    });
});
