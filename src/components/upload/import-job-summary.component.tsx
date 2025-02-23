import { ImportJob } from "../../types/types";
import BalanceComponent from "../balance.component";
import DateComponent from "../format/date.component";
import Translation from "../localization/translation.component";


const ImportJobSummaryComponent = ({ importJob }: { importJob: ImportJob }) => {

    return <>
        <div className='flex gap-5 md:gap-16 flex-wrap'>
            <div className='p-5 rounded-xl bg-blue-100 flex-grow md:flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                             label='BatchImport.created'/>
                <DateComponent date={ importJob.created }/>
            </div>

            <div className='p-5 rounded-xl bg-gray-100 flex-grow md:flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                             label='BatchImport.finished'/>
                <DateComponent date={ importJob.finished }/>
            </div>

            <div className='p-5 rounded-xl bg-red-100 flex-grow md:flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                             label='BatchImport.totalExpenses'/>
                <BalanceComponent importSlug={ importJob.slug }
                                  income={ false }/>
            </div>

            <div className='p-5 rounded-xl bg-green-100 flex-grow md:flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                             label='BatchImport.totalIncome'/>
                <BalanceComponent importSlug={ importJob.slug }
                                  income={ true }/>
            </div>
        </div>
    </>
}

export default ImportJobSummaryComponent