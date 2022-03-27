import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from 'src/frontend/serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'

import { Router } from 'src/frontend/Router'
import { Store } from 'src/frontend/store'
import { graphqlClient } from 'src/frontend/utils/graphql'

import 'src/assets/styles/style.scss'

ReactDOM.render(
    <ApolloProvider client={graphqlClient}>
        <React.StrictMode>
            <BrowserRouter>
                <Store>
                    <Router />
                </Store>
            </BrowserRouter>
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
