import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import RescueHistoryPage from './RescueHistoryPage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));
jest.mock('react-native-snackbar', () => ({
    show: jest.fn(),
}));

describe('RescueHistoryPage', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(
            <RescueHistoryPage rescueNumber={2} navigation={{}} />
        );

        expect(getByTestId('user-name')).toBeDefined();
        expect(getByTestId('button-left-arrow')).toBeDefined();
    });

    it('renders no rescues message when rescueNumber is 0', () => {
        const { queryByTestId } = render(
            <RescueHistoryPage rescueNumber={0} navigation={{}} />
        );
        expect(queryByTestId('no-rescues-message')).toBeDefined();
    });

    it('handles click on back arrow', () => {
        const goBack = jest.fn();

        const { getByTestId } = render(
            <RescueHistoryPage navigation={{ goBack }} />
        );

        const backButton = getByTestId('button-left-arrow');
        fireEvent.press(backButton);

        expect(goBack).toHaveBeenCalled();
    });


});
