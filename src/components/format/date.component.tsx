import useLocalStorage from "../../hooks/local-storage.hook";

const _ = ({ date }: { date?: string }) => {
    const [language] = useLocalStorage('language', 'en');

    if (date) {
        const formatted = new Intl.DateTimeFormat(language as string).format(new Date(date))
        return (
            <span className='FormattedDate'>{formatted}</span>
        )
    }

    return <></>
}

export default _