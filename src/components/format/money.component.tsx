import useLocalStorage from "../../hooks/local-storage.hook";

type MoneyProps = {
    money?: number
    currency?: string
  className?: string
}

const _ = ({ money = 0.0, currency = sessionStorage.getItem('currency') ?? 'EUR', className }: MoneyProps) => {
    const [language] = useLocalStorage('language', 'en');
    const greenClass = money > 0 ? 'text-green-800' : money < 0 ? 'text-red-800' : ''
    const formatter = new Intl.NumberFormat(language as string, {
        currency: currency,
        style: 'currency'
    })

    return (
        <span data-testid="money" className={ `${greenClass} ${className}`}>{formatter.format(money)}</span>
    )
}

export default _
