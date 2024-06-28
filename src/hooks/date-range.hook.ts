import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Range, Ranges } from "../core/Dates";

/**
 * Consume a range from the path params {@code year} and {@code month}.
 */
const useDateRange = () : [Range] => {
    const { year, month } = useParams()
    const [range, setRange] = useState(() => Ranges.currentMonth())

    useEffect(() => {
        if (year && month) setRange(Ranges.forMonth(year, month))
    }, [year, month])

    return [range]
}

export default useDateRange