import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { setCookie, getCookie } from 'hono/cookie'
import { createYoga, createSchema } from "graphql-yoga"

const app = new Hono()

app.use((c, next) => {
  setCookie(c, 'hello', 'Hono')
  return next()
})

app.use((c, next) => {
  console.log("==============================")
  console.log(getCookie(c, 'hello'))
  console.log("==============================")
  return next()
})

//app.get('/', (c) => {
//  return c.text('Hello Hono!')
//})

const yoga = createYoga({
  graphqlEndpoint: '/',
  fetchAPI: {
    fetch,
    Request,
    ReadableStream,
    Response,
  },
  graphiql: true,
  landingPage: false,
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello world!',
      },
    },
  }),
})

app.mount('/graphql', yoga)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

