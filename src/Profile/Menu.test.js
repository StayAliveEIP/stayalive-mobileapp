import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect'
import { Menu } from './Menu'
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon')

describe('Menu', () => {
  const onClickMenu = jest.fn()
  let getByTestId

  beforeEach(() => {
    const navigation = {
      navigate: jest.fn(),
    }
    const renderResult = render(
      <Menu
        navigation={navigation}
        goTo="Maps"
        name="Mes Sauvetages"
        icon="help-buoy-outline"
        onClickMenu={onClickMenu}
      />
    )
    getByTestId = renderResult.getByTestId
  })

  it('renders text with props.name', () => {
    const navigation = {
      navigate: jest.fn(),
    }
    const { getByTestId } = render(
      <Menu
        goTo="Maps"
        name="Mes Sauvetages"
        icon="help-buoy-outline"
        onClickMenu={onClickMenu}
        navigation={navigation}
      />
    )
    const textMenu = getByTestId('text-menu')
    expect(textMenu).toBeTruthy()
    expect(textMenu).toHaveTextContent('Mes Sauvetages')
  })

  it('renders correctly with props', () => {
    const menuBox = getByTestId('box-menu')
    expect(menuBox).toBeTruthy()
    expect(menuBox).toHaveStyle({ borderColor: 'gray' })
  })

  it('renders icon', () => {
    const navigation = {
      navigate: jest.fn(),
    }
    const { getByTestId } = render(
      <Menu
        navigation={navigation}
        goTo="Maps"
        name="Mes Sauvetages"
        icon="help-buoy-outline"
        onClickMenu={() => {}}
      />
    )

    const iconMenu = getByTestId('icon-menu')
    expect(iconMenu).toBeDefined()
  })

  it('calls onClickMenu function when the right arrow button is pressed', () => {
    const button = getByTestId('button-right-arrow')
    const consoleLogSpy = jest.spyOn(console, 'log')

    fireEvent.press(button)
    expect(consoleLogSpy).toHaveBeenCalledWith('Menu Mes Sauvetages')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
