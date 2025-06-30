import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App.jsx';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { BrowserRouter as Router } from 'react-router-dom';

const uploadLink = createUploadLink({
  uri: "http://localhost:4003/graphql", // Your GraphQL server
  credentials: 'include', 
   headers: {
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  },
});

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>
  </StrictMode>,
);
