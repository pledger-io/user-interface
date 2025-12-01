import { useLocalStorage } from "primereact/hooks";
import { SupportedLocales } from "../../core/repositories/i18n-repository";

type FormattedPercentageProps = {
    percentage?: number,
    decimals?: number
}

const _ = ({ percentage = 0, decimals = 2 }: FormattedPercentageProps) => {
    const [language] = useLocalStorage<SupportedLocales>('en', 'language');
    const formatter = new Intl.NumberFormat(language as string, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    return <span className='Percentage'>{formatter.format(percentage * 100)}%</span>
}

export default _
