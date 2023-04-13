import hg from '@hgraph.io/sdk'

const subscription = `
subscription LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

const query = `
query LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

const container = document.getElementById('root')
function appendToDocument(data) {
  container.innerHTML =
    container.innerHTML + `<br/><pre>${JSON.stringify(data)}</pre>`
}

async function main() {
  const queryResponse = await hg(
    query /*{
    headers: {
      authorization:
        'Bearer <>',
    },
  }*/
  )

  console.dir(queryResponse, null)
  appendToDocument(queryResponse)
  const unsubscribe = await hg(subscription, {
    /*
    headers: {
      authorization:
        'Bearer <>',
    },*/
    // The client supports filtering the response date using jmespath -  https://jmespath.org/
    filter: 'data.transaction[0].consensus_timestamp',
    // handle the data
    next: (data: bigint) => {
      const diff =
        (BigInt(new Date().getTime()) - data / BigInt(1000000)) / BigInt(1000)
      console.log(`consensus_timestamp was about ${diff} seconds ago`)
      appendToDocument(`consensus_timestamp was about ${diff} seconds ago`)
    },
    error: (e: string) => {
      console.error(e)
    },
    complete: () => {
      console.log('Optionally do some cleanup')
      appendToDocument('Unsubscribed from GraphQL subscription')
    },
  })

  // clear subscription
  setTimeout(unsubscribe, 20000)
}

main()
