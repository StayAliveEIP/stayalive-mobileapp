import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AvailablePage, { TextSlider } from './AvailablePage.js';
import { colors } from '../Style/StayAliveStyle';

describe('AvailablePage', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(<AvailablePage />);
        const statusText = getByTestId('status-text');
        expect(statusText).toBeTruthy();
        expect(statusText.props.children).toBe('Disponible');
        const sliderContainer = getByTestId('slider-container');
        expect(sliderContainer).toBeTruthy();
    });

    it('calls onClickButton when "Se rendre indisponible" button is clicked', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<AvailablePage />);
        const button = getByTestId('indisponible-button');
        fireEvent.press(button);
        expect(consoleLogSpy).toHaveBeenCalledWith('Je me rends indisponible');
        consoleLogSpy.mockRestore();
    });

    it('calls onProfileBadgeClick when profile badge is clicked', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<AvailablePage />);
        const profileBadge = getByTestId('profile-badge');
        fireEvent.press(profileBadge);
        expect(consoleLogSpy).toHaveBeenCalledWith('Profile badge clicked');
        consoleLogSpy.mockRestore();
    });
});
