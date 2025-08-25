import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import './index.css'

// Create the HTTP link
const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql/",
});

// Create Apollo Client with explicit link
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
