import Client from '@hgraph.io/sdk'

const client = new Client()
const container = document.getElementById('root')

function appendToDocument(data) {
  container.innerHTML =
    container.innerHTML + `<br/><pre>${JSON.stringify(data)}</pre>`
}

const LatestTransaction = `
query LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

const LatestTransactionSubscription = LatestTransaction.trim().replace(
  'query',
  'subscription'
)

async function main() {
  const json = await client.query(LatestTransaction)

  appendToDocument(json)
  const unsubscribe = client.subscribe(LatestTransactionSubscription, {
    // handle the data
    next: (data) => {
      appendToDocument(data)
      console.log(data)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.log('Optionally do some cleanup')
      appendToDocument('Unsubscribed from GraphQL subscription')
    },
  })

  // clear subscription
  setTimeout(unsubscribe, 10000)
}

main()
