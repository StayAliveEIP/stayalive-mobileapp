import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
    FadeInView,
    SlideInView,
    ScaleInView,
    RotateInView,
} from './Animations';

describe('Animation Components', () => {
    it('renders FadeInView correctly', () => {
        const { getByTestId } = render(
            <FadeInView duration={1000} testID="fade-in-view">
                <Text testID="child-text">Hello World</Text>
            </FadeInView>
        );

        const fadeInView = getByTestId('fade-in-view');
        const childText = getByTestId('child-text');

        expect(fadeInView).toBeTruthy();
        expect(childText).toBeTruthy();
    });

    it('renders SlideInView correctly', () => {
        const { getByTestId } = render(
            <SlideInView duration={1000} value={-100} testID="slide-in-view">
                <Text testID="child-text">Hello World</Text>
            </SlideInView>
        );

        const slideInView = getByTestId('slide-in-view');
        const childText = getByTestId('child-text');

        expect(slideInView).toBeTruthy();
        expect(childText).toBeTruthy();
    });

    it('renders ScaleInView correctly', () => {
        const { getByTestId } = render(
            <ScaleInView duration={1000} testID="scale-in-view">
                <Text testID="child-text">Hello World</Text>
            </ScaleInView>
        );

        const scaleInView = getByTestId('scale-in-view');
        const childText = getByTestId('child-text');

        expect(scaleInView).toBeTruthy();
        expect(childText).toBeTruthy();
    });

    it('renders RotateInView correctly', () => {
        const { getByTestId } = render(
            <RotateInView testID="rotate-in-view">
                <Text testID="child-text">Hello World</Text>
            </RotateInView>
        );

        const rotateInView = getByTestId('rotate-in-view');
        const childText = getByTestId('child-text');

        expect(rotateInView).toBeTruthy();
        expect(childText).toBeTruthy();
    });
});
