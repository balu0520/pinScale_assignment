import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import DisplayResult from "../DisplayResult";

const client = new ApolloClient({
    uri: "https://spacex-production.up.railway.app/",
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    launchesPast: offsetLimitPagination()
                },
            },
        },
    })
})

const GraphqlComponent = () => (
    <ApolloProvider client={client}>
        <DisplayResult />
    </ApolloProvider>
)

export default GraphqlComponent