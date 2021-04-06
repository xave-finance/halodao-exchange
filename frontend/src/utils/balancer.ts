import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export async function subgraphRequest(url: string, query: {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: jsonToGraphQLQuery({ query }) })
  })
  const { data } = await res.json()
  return data || {}
}
