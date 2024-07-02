import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../components/layout/button";
import Translation from "../../components/localization/translation.component";
import NavigationComponent from "../../components/profile/navigation.component";
import { mdiApplicationExport } from "@mdi/js";
import ProfileRepository from "../../core/repositories/profile.repository";

import Card from "../../components/layout/card.component";

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

        <Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent/>
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translation label='page.user.profile.export'/></h1>

                    <div className='h-full flex items-center justify-center'>
                        <Button label='page.user.profile.export'
                                        icon={ mdiApplicationExport }
                                        onClick={ downloadClick }/>
                    </div>
                </div>
            </div>
        </Card>
    </>
}

export default ProfileExportView