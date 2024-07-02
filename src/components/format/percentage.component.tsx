import useLocalStorage from "../../hooks/local-storage.hook";

type FormattedPercentageProps = {
    percentage?: number,
    decimals?: number
}

const _ = ({ percentage = 0, decimals = 2 }: FormattedPercentageProps) => {
    const [language] = useLocalStorage('language', 'en');
    const formatter = new Intl.NumberFormat(language as string, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    return <span className='Percentage'>{formatter.format(percentage * 100)}%</span>
}

export default _