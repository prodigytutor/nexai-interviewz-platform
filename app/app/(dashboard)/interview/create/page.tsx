import React from 'react'
import NewInterviewModal from '@/components/modal/new-interview'
import CreateInterviewButton from '@/components/create-interview-button'
type Props = {
  userId: string
}

const CreateInterview = (props: Props) => {
  return (
    <div><CreateInterviewButton userid={props.userId}>
        <NewInterviewModal />
      </CreateInterviewButton></div>
  )
}