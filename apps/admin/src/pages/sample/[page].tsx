import React from 'react'
import Voting from '@/components/period/voting'

function samplepage() {
  const [period, setPeriod] = React.useState('')

  React.useEffect(() => {
    fetch('https://6735117f5995834c8a91ce0c.mockapi.io/api/v1/period')
      .then((response) => response.json())
      .then((data) => {
        setPeriod(data[0].period)
      })
  }, [])

  if (!period) {
    return <div>Loading...</div>
  }
  if (period.includes('voting')) {
    return <Voting />
  }
  if (period.includes('pretest')) {
    return <div>Pretest</div>
  }
}

export default samplepage
