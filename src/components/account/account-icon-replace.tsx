import { Icon } from "@iconify-icon/react";
import React, { FC, useState } from "react";
import ImageAttachment from "../../core/attachment/image-attachment";
import UploadAttachment from "../../core/attachment/upload-component";
import {  Attachment } from "../../types/types";
import { Button } from "../layout/button";

type AccountIconReplaceProps = {
  account?: {
    imageIcon: string
    name: string
  }
  onChange: (attachment: Attachment) => void
}

export const AccountIconReplace: FC<AccountIconReplaceProps> = ({ account, onChange }) => {
  const [ upload, setUpload ] = useState<boolean>(false)

  if (!account?.name) return <>
    <Icon icon={ 'mdi:cancel' } width='16em' className='text-gray-500/20 mx-auto'/>
  </>;

  const afterUpload = (attachment: Attachment) => {
    setUpload(false)
    onChange(attachment)
  }

  const showUpload = !account.imageIcon || upload
  return <>
    { showUpload &&
      <UploadAttachment label='page.accounts.accounts.changeIcon'
                        accepts='image/*'
                        onUpload={ afterUpload }/>
    }
    { !showUpload &&
      <div className='flex flex-col items-center justify-center h-full'>
        <ImageAttachment fileCode={ account.imageIcon } />
        <Button icon={ 'mdi:image-refresh-outline' }
                onClick={ () => setUpload(true) }
                label='page.accounts.accounts.changeIcon'
                text/>
      </div>
    }
  </>
}