import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AccountPage from './AccountPage';
import { launchImageLibrary } from 'react-native-image-picker';

jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

describe('AccountPage Component', () => {
  it('renders correctly with profile data', async () => {
    const mockProfileData = {
      firstname: 'John',
      lastname: 'Doe',
      email: {
        email: 'john.doe@example.com',
        verified: true,
      },
      phone: {
        phone: '123-456-7890',
        verified: false,
      },
    };

    const mockAsyncStorage = require('@react-native-async-storage/async-storage');
    mockAsyncStorage.getItem.mockResolvedValueOnce('mockToken');

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockProfileData),
    });

    const { getByTestId, queryByTestId } = render(<AccountPage navigation={{ goBack: jest.fn() }} />);

    await waitFor(() => {
      const loadingSpinner = queryByTestId('loading-spinner');
      expect(loadingSpinner).toBeFalsy();

      const userAvatar = getByTestId('user-avatar');
      expect(userAvatar).toBeTruthy();
    });

    fetchSpy.mockRestore();
  });

  it('calls goBack when the left arrow button is pressed', () => {
    const goBackMock = jest.fn();
    const { getByTestId } = render(<AccountPage navigation={{ goBack: goBackMock }} />);
    const leftArrowButton = getByTestId('button-left-arrow');

    fireEvent.press(leftArrowButton);

    expect(goBackMock).toHaveBeenCalledTimes(1);
  });

  it('calls saveChanges when the save button is pressed', async () => {
    const { getByTestId } = render(<AccountPage navigation={{ goBack: jest.fn() }} />);
    const saveButton = getByTestId('save-button');

    const consoleLogSpy = jest.spyOn(console, 'log');

    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Save Changes !');
    });

    consoleLogSpy.mockRestore();
  });

  it('updates avatar source on image selection', async () => {
    const { getByTestId } = render(<AccountPage navigation={{ goBack: jest.fn() }} />);
    const selectImageButton = getByTestId('select-image-button');

    launchImageLibrary.mockImplementation((options, callback) => {
      const response = { uri: 'selected-image-uri' };
      callback(response);
    });

    act(() => {
      fireEvent.press(selectImageButton);
    });

    await waitFor(() => {
      expect(launchImageLibrary).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaType: 'photo',
        }),
        expect.any(Function)
      );
    });
  });

  it('logs cancellation message on image picker cancellation', async () => {
    const { getByTestId } = render(<AccountPage navigation={{ goBack: jest.fn() }} />);
    const selectImageButton = getByTestId('select-image-button');
    const consoleLogSpy = jest.spyOn(console, 'log');

    launchImageLibrary.mockImplementation((options, callback) => {
      const response = { didCancel: true };
      callback(response);
    });

    act(() => {
      fireEvent.press(selectImageButton);
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('User cancelled image picker');
  });

  it('logs error message on image picker error', async () => {
    const { getByTestId } = render(<AccountPage navigation={{ goBack: jest.fn() }} />);
    const selectImageButton = getByTestId('select-image-button');
    const consoleLogSpy = jest.spyOn(console, 'log');

    launchImageLibrary.mockImplementation((options, callback) => {
      const response = { error: 'image-picker-error' };
      callback(response);
    });

    act(() => {
      fireEvent.press(selectImageButton);
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('Image picker error:', 'image-picker-error');
  });
});
