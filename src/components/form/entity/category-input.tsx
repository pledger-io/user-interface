import CategoryRepository from "../../../core/repositories/category-repository";
import restApi from "../../../core/repositories/rest-api";
import { Category, Identifiable } from "../../../types/types";
import { useAutocomplete } from "../Autocomplete";
import { FieldType } from "../form-types";

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
    inputOnly?: boolean,
    onChange?: (_: Category) => void
    title?: string,
    className?: string
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
    const { inputOnly = false } = props

    return useAutocomplete<AutocompleteCategory>({
        autoCompleteCallback: value => restApi.get<Category[]>(`categories/auto-complete?token=${value}`)
            .then((categories) => categories.map(mapCategoryToAutocomplete)),
        entityLabel: (category: AutocompleteCategory) => category?.name,
        entityRender: CategoryAutocompleteRow,
        onCreateCallback: inputOnly ? undefined : onCreateCallback
    }, props)
}
