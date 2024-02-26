import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect'
import RescueHistoryPage from './RescueHistoryPage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}))
jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
}))
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          address:
            'Ecole informatique Paris - Epitech, 14-16 Rue Voltaire, 94270 Le Kremlin-Bicêtre, France',
          id: '65b90fd9d754d40b434804b3',
          info: 'John Doe un homme de 37 ans est bléssé.',
          status: 'RESOLVED',
        },
        {
          address: 'Addresse test, France',
          id: '65cc7b309470091768b81b26',
          info: 'Sarah Dumbell une femme de 28 ans est bléssée.',
          status: 'RESOLVED',
        },
      ]),
  })
)

describe('RescueHistoryPage', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<RescueHistoryPage rescueNumber={2} />)

    expect(getByTestId('user-name')).toBeDefined()
    expect(getByTestId('button-left-arrow')).toBeDefined()
  })

  it('renders no rescues message when rescueNumber is 0', async () => {
    const { queryByTestId } = render(<RescueHistoryPage rescueNumber={0} />)
    expect(queryByTestId('no-rescues-message')).toBeDefined()
  })
  it('handles click on back arrow', () => {
    const goBack = jest.fn()

    const { getByTestId } = render(
      <RescueHistoryPage navigation={{ goBack }} />
    )

    const backButton = getByTestId('button-left-arrow')
    fireEvent.press(backButton)

    expect(goBack).toHaveBeenCalled()
  })
})
