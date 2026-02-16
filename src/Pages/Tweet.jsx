import React from 'react'
import MainLayout from '../layout/MainLayout'
import Tweets from '../components/Tweets'

const Tweet = () => {
  return (
    <MainLayout>
      <div className="p-4">
        
        {/* You can add your tweets content here */}
        <Tweets/>
      </div>
    </MainLayout>
  )
}

export default Tweet
