import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParam = ({ key, initialValue }: { initialValue: string | (() => string), key: string }) => {
    const [value, setValue] = useState(initialValue)
    const [searchParams]    = useSearchParams()

    useEffect(() => {
        if (searchParams.has(key) && searchParams.get(key) !== value) setValue(searchParams.get(key) as string)
        else if (!searchParams.has(key)) setValue(initialValue)
    }, [searchParams, initialValue, key, value])

    return [value]
}

export default useQueryParam