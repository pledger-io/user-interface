import { ImportJob } from "../../core/types";
import { Formats, Statistical } from "../../core";
import Translation from "../localization/translation.component";


const ImportJobSummaryComponent = ({ importJob }: { importJob: ImportJob }) => {

    return <>
        <div className='flex gap-16 flex-wrap'>
            <div className='p-5 rounded-xl bg-blue-100 flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                                          label='BatchImport.created'/>
                <Formats.Date date={ importJob.created }/>
            </div>

            <div className='p-5 rounded-xl bg-gray-100 flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                                          label='BatchImport.finished'/>
                <Formats.Date date={ importJob.finished }/>
            </div>

            <div className='p-5 rounded-xl bg-red-100 flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                                          label='BatchImport.totalExpenses'/>
                <Statistical.Balance importSlug={ importJob.slug }
                                     income={ false }/>
            </div>

            <div className='p-5 rounded-xl bg-green-100 flex-1
                            flex flex-col gap-1 justify-center items-center'>
                <Translation className='font-bold'
                                          label='BatchImport.totalIncome'/>
                <Statistical.Balance importSlug={ importJob.slug }
                                     income={ true }/>
            </div>
        </div>
    </>
}

export default ImportJobSummaryComponent