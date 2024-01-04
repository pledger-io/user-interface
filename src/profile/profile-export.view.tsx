import { BreadCrumbItem, BreadCrumbs, Buttons, Layout, Translations } from "../core";
import NavigationComponent from "./navigation.component";
import { mdiApplicationExport } from "@mdi/js";
import ProfileRepository from "../core/repositories/profile.repository";

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
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile'/>
            <BreadCrumbItem label='page.user.profile.export'/>
        </BreadCrumbs>

        <Layout.Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent/>
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translations.Translation label='page.user.profile.export'/></h1>

                    <div className='h-full flex items-center justify-center'>
                        <Buttons.Button label='page.user.profile.export'
                                        icon={ mdiApplicationExport }
                                        onClick={ downloadClick }/>
                    </div>
                </div>
            </div>
        </Layout.Card>
    </>
}

export default ProfileExportView