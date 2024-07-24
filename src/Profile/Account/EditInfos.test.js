import React from 'react'
import { render } from '@testing-library/react-native'
import { EditInfosMenu } from './EditInfos'

describe('EditInfosMenu Component', () => {
  const mockVariable = {
    name: 'John Doe',
    phone: {
      phone: '123-456-7890',
    },
    email: {
      email: 'john.doe@example.com',
    },
  }

  it('renders correctly with required props', () => {
    const { getByTestId } = render(
      <EditInfosMenu
        name="Name"
        indexVariable="name"
        variable={mockVariable}
        setVariable={() => {}}
        edit={false}
      />
    )

    const boxMenu = getByTestId('box-menu')
    const textMenu = getByTestId('text-menu')

    expect(boxMenu).toBeTruthy()
    expect(textMenu).toBeTruthy()
  })

  it('renders Text when not in edit mode', () => {
    const { getByTestId } = render(
      <EditInfosMenu
        name="Email"
        indexVariable="email"
        variable={mockVariable}
        setVariable={() => {}}
        edit={false}
      />
    )

    const textElement = getByTestId('text-element')

    expect(textElement).toBeTruthy()
  })
})
