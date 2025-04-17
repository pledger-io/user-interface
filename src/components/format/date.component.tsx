import { useLocalStorage } from "primereact/hooks";
import { SupportedLocales } from "../../config/prime-locale";

const _ = ({ date, className = '' }: { date?: string, className?: string }) => {
    const [language] = useLocalStorage<SupportedLocales>('en', 'language');

    if (date) {
        const formatted = new Intl.DateTimeFormat(language as string).format(new Date(date))
        return (
            <span className={`FormattedDate ${className}`}>{formatted}</span>
        )
    }

    return <></>
}

export default _
