import PropTypes from 'prop-types';

import { InputGroup } from "../input/InputGroup";
import { useAutocomplete } from "../Autocomplete";
import restAPI from "../../repositories/rest-api";
import { Identifiable, Category } from "../../types";
import { FieldType } from "../form-types";
import CategoryRepository from "../../repositories/category-repository";

type AutocompleteCategory = Identifiable & {
    name: string,
    description: string
}

const CategoryAutocompleteRow = (category: AutocompleteCategory) => {
    return (
        <span>
            {category.name}
            <div className='Summary'>{category.description}</div>
        </span>
    )
}

type CategoryInputProps = FieldType & {
    value?: Category,
}

function mapCategoryToAutocomplete(category: Category): AutocompleteCategory {
    return {
        id: category.id,
        name: category.label,
        description: category.description
    }
}

export const CategoryInput = (props: CategoryInputProps) => {
    const onCreateCallback = (name: string) => CategoryRepository.create({
        name: name
    }).then(mapCategoryToAutocomplete)

    return useAutocomplete({
        autoCompleteCallback: value => restAPI.get<Category[]>(`categories/auto-complete?token=${value}`)
            .then((categories) => categories.map(mapCategoryToAutocomplete)),
        entityLabel: category => category?.name,
        entityRender: CategoryAutocompleteRow,
        onCreateCallback: onCreateCallback
    }, props)
}
CategoryInput.propTypes = {
    ...InputGroup.propTypes,
    value: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func
}
