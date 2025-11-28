import { useLocalStorage } from "primereact/hooks";
import { SupportedLocales } from "../../core/repositories/i18n-repository";

const _ = ({ date }: { date?: string }) => {
  const [language] = useLocalStorage<SupportedLocales>('en', 'language');

  if (date) {
    const formatted = new Intl.DateTimeFormat(language as string, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date))
    return (
      <span className='FormattedDate'>{ formatted }</span>
    )
  }

  return <></>
}

export default _