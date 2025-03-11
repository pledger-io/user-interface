import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Form } from "../Form";
import { AmountInput } from './AmountInput'

const formWrapped = (component: any) => {
  return <Form entity='TestForm' onSubmit={ _ => undefined }>
    { component }
  </Form>
}

describe('AmountInput', () => {
  const defaultProps = {
    id: 'amount',
    title: 'text.amount',
    value: 100.5,
    required: true,
    readonly: false,
    currency: 'USD',
    className: '',
    onChange: vi.fn(),
  }

  it('renders correctly', () => {
    const { getByTestId } = render(formWrapped(<AmountInput { ...defaultProps } />))
    expect(getByTestId('amount-label')).toBeInTheDocument()
    expect(getByTestId('amount-input'))
      .toHaveValue('$100.50')
      .toBeInTheDocument()
  })

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn()

    const { getByTestId } = render(formWrapped(<AmountInput { ...defaultProps } onChange={ handleChange }/>))

    const input = getByTestId('amount-input')
    fireEvent.change(input, { target: { value: '200' } })
    fireEvent.blur(input)

    expect(input).toHaveValue('$200.00')
  })

})
