import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import DateTimeComponent from "../../components/format/date-time.component";
import Translation from "../../components/localization/translation.component";
import { useEffect, useState } from "react";
import ProfileRepository from "../../core/repositories/profile.repository";

import NavigationComponent from "../../components/profile/navigation.component";
import Card from "../../components/layout/card.component";

type Session = {
    description: string
    validFrom: string
    validUntil: string
    token: string
}

const ProfileSessionsView = () => {
    const [sessions, setSessions] = useState<Session[]>([])

    useEffect(() => {
        ProfileRepository.sessions()
            .then((sessions) => setSessions(sessions))
            .catch(console.error)
    }, []);

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile' />
            <BreadCrumbItem label='page.title.user.session.active' />
        </BreadCrumbs>

        <Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translation label='page.title.user.session.active' /></h1>

                    <table className='Table mt-5'>
                        <thead>
                        <tr>
                            <th><Translation label='SessionToken.description' /></th>
                            <th><Translation label='SessionToken.validFrom' /></th>
                            <th><Translation label='SessionToken.validUntil' /></th>
                        </tr>
                        </thead>
                        <tbody>
                        { sessions?.map((session) => <tr key={ session.token }>
                            <td>{ session.description }</td>
                            <td><DateTimeComponent date={ session.validFrom } /></td>
                            <td><DateTimeComponent date={ session.validUntil } /></td>
                        </tr>) }
                        </tbody>
                    </table>

                </div>
            </div>
        </Card>
    </>
}

export default ProfileSessionsView