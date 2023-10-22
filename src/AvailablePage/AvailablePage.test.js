import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AvailablePage, { TextSlider } from './AvailablePage.js';
import fetchMock from 'jest-fetch-mock';
import { colors } from '../Style/StayAliveStyle';

fetchMock.enableMocks();

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
  }));

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

describe('AvailablePage', () => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
    it('renders correctly', () => {
        const { getByTestId } = render(<AvailablePage navigation={mockNavigation} />);
        const statusText = getByTestId('status-text');
        expect(statusText).toBeTruthy();
        expect(statusText.props.children).toBe('Disponible');
        const sliderContainer = getByTestId('slider-container');
        expect(sliderContainer).toBeTruthy();
    });

    it('calls onClickButton when "Se rendre indisponible" button is clicked', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<AvailablePage navigation={mockNavigation} />);
        const button = getByTestId('indisponible-button');
        fireEvent.press(button);
        expect(consoleLogSpy).toHaveBeenCalledWith('Je me rends indisponible');
        consoleLogSpy.mockRestore();
    });

    it('calls onProfileBadgeClick when profile badge is clicked', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        const { getByTestId } = render(<AvailablePage navigation={mockNavigation} />);
        const profileBadge = getByTestId('profile-badge');
        fireEvent.press(profileBadge);
        expect(consoleLogSpy).toHaveBeenCalledWith('Profile badge clicked');
        consoleLogSpy.mockRestore();
    });
});
