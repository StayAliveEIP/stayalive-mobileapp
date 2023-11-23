import React from 'react'
import { render } from '@testing-library/react-native'
import IntroductionPage from './IntroductionPage'

describe('IntroductionPage Component', () => {
  it('renders IntroductionPage with all components', () => {
    const { getByTestId, getByText } = render(<IntroductionPage />)

    const introPage1 = getByTestId('introImage1')
    const introPage2 = getByTestId('introImage2')
    const introPage3 = getByTestId('introImage3')

    expect(introPage1).toBeTruthy()
    expect(introPage2).toBeTruthy()
    expect(introPage3).toBeTruthy()

    const logo1 = getByTestId('introLogo1')
    const logo2 = getByTestId('introLogo2')
    const logo3 = getByTestId('introLogo3')

    expect(logo1).toBeTruthy()
    expect(logo2).toBeTruthy()
    expect(logo3).toBeTruthy()

    const title1 = getByText('Bienvenue sur StayAlive !')
    const title2 = getByText('Le but de StayAlive')
    const title3 = getByText('Le fonctionnement de StayAlive !')

    expect(title1).toBeDefined()
    expect(title2).toBeDefined()
    expect(title3).toBeDefined()
  })
})
