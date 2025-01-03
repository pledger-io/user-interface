import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DateRange from "../types/date-range.type";
import DateRangeService from "../service/date-range.service";

/**
 * Consume a range from the path params {@code year} and {@code month}.
 */
const useDateRange = () : [DateRange] => {
    const { year, month } = useParams()
    const [range, setRange] = useState(() => DateRangeService.currentMonth())

    useEffect(() => {
        if (year && month) setRange(DateRangeService.forMonth(parseInt(year), parseInt(month)))
    }, [year, month])

    return [range]
}

export default useDateRange