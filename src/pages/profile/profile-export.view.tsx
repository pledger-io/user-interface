import { mdiApplicationExport } from "@mdi/js";
import { Button } from "../../components/layout/button";
import { i10n } from "../../config/prime-locale";
import ProfileRepository from "../../core/repositories/profile.repository";

const ProfileExportView = () => {

  const downloadClick = () => {
    ProfileRepository.exportProfile()
      .then(data => {
        const dataUri = window.URL.createObjectURL(data as Blob)

        const hiddenClicker = document.createElement('a')
        hiddenClicker.href = dataUri
        hiddenClicker.download = 'profile-export.json'
        hiddenClicker.dispatchEvent(new MouseEvent('click'))
      })
      .catch(console.log)
  }

  return <>
    <h1 className='font-bold text-lg'>{ i10n('page.user.profile.export') }</h1>

    <div className='h-full flex items-center justify-center'>
      <Button label='page.user.profile.export'
              icon={ mdiApplicationExport }
              onClick={ downloadClick }/>
    </div>
  </>
}

export default ProfileExportView
