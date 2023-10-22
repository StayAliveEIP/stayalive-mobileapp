import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UnavailablePage from './UnavailablePage';
import { colors } from '../Style/StayAliveStyle';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

describe('UnavailablePage', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<UnavailablePage navigation={mockNavigation} />);

    const statusText = getByTestId('status-text');
    expect(statusText).toBeTruthy();
    expect(statusText.props.children).toBe('Votre statut:');
    const statusIndisponible = getByTestId('status-indisponible');
    expect(statusIndisponible.props.style).toMatchObject({color: colors.StayAliveRed});
  });

  it('calls onClickButton when "Se rendre Disponible" button is clicked', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    const { getByTestId } = render(<UnavailablePage navigation={mockNavigation} />);
    const button = getByTestId('available-button');
    fireEvent.press(button);
    expect(consoleLogSpy).toHaveBeenCalledWith('Je me rends Disponible');
    consoleLogSpy.mockRestore();
  });

  it('calls onProfileBadgeClick when profile badge is clicked', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    const { getByTestId } = render(<UnavailablePage navigation={mockNavigation} />);
    const profileBadge = getByTestId('profile-badge');
    fireEvent.press(profileBadge);
    expect(consoleLogSpy).toHaveBeenCalledWith('Profile badge clicked');
    consoleLogSpy.mockRestore();
  });
});
