import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { mockedAxios } from "../../../../__mocks__/axios";
import { NotificationProvider } from "../../../context/notification-context";
import { Form } from "../Form";
import { CategoryInput } from './category-input'

vi.mock('../../../core/repositories/category-repository', () => ({
  default: {
    create: vi.fn(() => Promise.resolve({ id: 1, name: 'New Category' })),
  },
}))

const mockProps = {
  id: 'selector',
  title: 'cat.auto.complete',
  onChange: vi.fn(),
  value: null,
}

const formWrapped = (component: any) => {
  return <Form entity='TestForm' onSubmit={ _ => undefined }>
    <NotificationProvider>
      { component }
    </NotificationProvider>
  </Form>
}

describe('CategoryInput', () => {

  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: { content: [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }] } })
    mockProps.onChange.mockReset()
  })

  it('should render the label and input field correctly', () => {
    const { getByTestId, getByRole } = render(formWrapped(<CategoryInput { ...mockProps } />))

    const label = getByTestId('category-input-' + mockProps.id)
    const input = getByRole('combobox')

    expect(label).toHaveTextContent('_missing_localization_cat.auto.complete_en_')
    expect(input).toBeInTheDocument()
  })

  it('should fetch and render categories when autocomplete is triggered', async () => {
    const { getByTestId, getByRole } = render(formWrapped(<CategoryInput { ...mockProps } />))
    const input = getByRole('combobox')

    fireEvent.change(input, { target: { value: 'Category' } })

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith('categories', {
      "params": {
        "name": "Category",
        "numberOfResults": 20,
        "offset": 0,
      }
    }))
    await waitFor(() => expect(getByTestId(`category-autocomplete-row-1`)).toHaveTextContent('Category 1'))
  })

  it('should call onChange when a category is selected', async () => {
    const { getByTestId, getByRole } = render(formWrapped(<CategoryInput { ...mockProps } />))

    const input = getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Selected Category' } })

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith('categories', {
      "params": {
        "name": "Category",
        "numberOfResults": 20,
        "offset": 0,
      }
    }))

    const category1 = await waitFor(() => getByTestId(`category-autocomplete-row-1`))
    fireEvent.click(category1)

    expect(mockProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Category 1'
      })
    )
  })

  it('should create a new category and call onChange when "Add" is clicked', async () => {
    const { getByRole, getByTestId } = render(formWrapped(<CategoryInput { ...mockProps } />))

    const input = getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Selected Category' } })

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith('categories', {
      params: {
        name: 'Selected Category',
        numberOfResults: 20,
        offset: 0,
      }
    }))
    await waitFor(() => fireEvent.click(getByTestId('autocomplete-input-create')))

    await waitFor(() => {
      expect(mockProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'New Category'
        })
      )
    })
  })

})
