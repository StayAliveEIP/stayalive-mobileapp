import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
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

  it('renders TextInput when in edit mode', () => {
    const { getByTestId } = render(
      <EditInfosMenu
        name="Phone"
        indexVariable="phone"
        variable={mockVariable}
        setVariable={() => {}}
        edit={true}
      />
    )

    const textInput = getByTestId('text-input')

    expect(textInput).toBeTruthy()
  })

  it('calls setVariable with updated data when TextInput value changes', async () => {
    const setVariableMock = jest.fn()

    const { getByTestId } = render(
      <EditInfosMenu
        name="Name"
        indexVariable="name"
        variable={mockVariable}
        setVariable={setVariableMock}
        edit={true}
      />
    )

    const textInput = getByTestId('text-input')

    fireEvent.changeText(textInput, 'New Name')

    await waitFor(() => {
      expect(setVariableMock).toHaveBeenCalledWith({
        ...mockVariable,
        name: 'New Name',
      })
    })
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
