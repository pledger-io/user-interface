import { mdiDownload } from "@mdi/js";
import { Button } from "../../components/layout/button";
import { i10n } from "../../config/prime-locale";
import ProfileRepository from "../../core/repositories/profile.repository";

const ProfileExportView = () => {

  const downloadClick = () => {
    ProfileRepository.exportTransactions()
      .then(data => {
        const dataUri = window.URL.createObjectURL(data as Blob)

        const hiddenClicker = document.createElement('a')
        hiddenClicker.href = dataUri
        hiddenClicker.download = `Transactions-${ new Date().toISOString().substring(0, 10) }.csv`
        hiddenClicker.dispatchEvent(new MouseEvent('click'))
      })
      .catch(console.log)
  }

  return <>
    <h1 className='font-bold text-lg'>{ i10n('page.user.profile.transactions') }</h1>

    <div className='h-full flex items-center justify-center'>
      <Button label='page.user.profile.transactions'
              icon={ mdiDownload }
              onClick={ downloadClick }/>
    </div>
  </>
}

export default ProfileExportView
