import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import DateTimeComponent from "../../components/format/date-time.component";
import { i10n } from "../../config/prime-locale";
import ProfileRepository from "../../core/repositories/profile.repository";

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
    <h1 className='font-bold text-lg'>{ i10n('page.title.user.session.active') }</h1>

    <DataTable value={ sessions } loading={ !sessions } size='small'>
      <Column header={ i10n('SessionToken.description') } field='description'/>
      <Column header={ i10n('SessionToken.validFrom') } body={ session => <DateTimeComponent date={ session.validFrom }/> }/>
      <Column header={ i10n('SessionToken.validUntil') } body={ session => <DateTimeComponent date={ session.validUntil }/> }/>
    </DataTable>
  </>
}

export default ProfileSessionsView
