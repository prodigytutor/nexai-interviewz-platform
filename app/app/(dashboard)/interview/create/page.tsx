import React from 'react'
import NewInterviewModal from '@/components/modal/new-interview'
import CreateInterviewButton from '@/components/create-interview-button'
type Props = {}

const CreateInterview = (props: Props) => {
  return (
    <div><CreateInterviewButton>
        <NewInterviewModal />
      </CreateInterviewButton></div>
  )
}