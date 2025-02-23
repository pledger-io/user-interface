import useLocalStorage from "../../hooks/local-storage.hook";

const _ = ({ date, className = '' }: { date?: string, className?: string }) => {
    const [language] = useLocalStorage('language', 'en');

    if (date) {
        const formatted = new Intl.DateTimeFormat(language as string).format(new Date(date))
        return (
            <span className={`FormattedDate ${className}`}>{formatted}</span>
        )
    }

    return <></>
}

export default _