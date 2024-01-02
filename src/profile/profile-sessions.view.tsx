import { BreadCrumbItem, BreadCrumbs, Formats, Layout, Translations } from "../core";
import NavigationComponent from "./navigation.component";
import { useEffect, useState } from "react";
import ProfileRepository from "../core/repositories/profile.repository";

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

        <Layout.Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translations.Translation label='page.title.user.session.active' /></h1>

                    <table className='Table mt-5'>
                        <thead>
                        <tr>
                            <th><Translations.Translation label='SessionToken.description' /></th>
                            <th><Translations.Translation label='SessionToken.validFrom' /></th>
                            <th><Translations.Translation label='SessionToken.validUntil' /></th>
                        </tr>
                        </thead>
                        <tbody>
                        { sessions.map((session, index) => <tr key={index}>
                            <td>{ session.description }</td>
                            <td><Formats.DateTime date={ session.validFrom } /></td>
                            <td><Formats.DateTime date={ session.validUntil } /></td>
                        </tr>) }
                        </tbody>
                    </table>

                </div>
            </div>
        </Layout.Card>
    </>
}

export default ProfileSessionsView