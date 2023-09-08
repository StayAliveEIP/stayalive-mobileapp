import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilePage from './ProfilePage';

describe('ProfilePage', () => {
    it('displays user name', () => {
        const { getByTestId } = render(<ProfilePage />);
        const userName = getByTestId('user-name');
        expect(userName).toBeTruthy();
        expect(userName.props.children).toBe('Louis AUTEF');
    });

    it('clicks the left arrow button', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<ProfilePage />);
        const leftArrowButton = getByTestId('button-left-arrow');
        fireEvent.press(leftArrowButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('arrow left clicked !');
        consoleLogSpy.mockRestore();
    });

    it('clicks the disconnect button', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<ProfilePage />);
        const leftArrowButton = getByTestId('button-disconnect');
        fireEvent.press(leftArrowButton);
        expect(consoleLogSpy).toHaveBeenCalledWith('disconnect button press !');
        consoleLogSpy.mockRestore();
    });
});
