import React from 'react'
import ReactDOM from 'react-dom/client'
import * as serviceWorker from 'src/frontend/serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Router } from 'src/frontend/Router'
import { Store } from 'src/frontend/store'

const queryClient = new QueryClient()

const root = document.getElementById('root')
if (root) {
    const dom = ReactDOM.createRoot(root)
    dom.render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Store>
                    <Router />
                </Store>
            </BrowserRouter>
        </QueryClientProvider>,
    )
}

if (window.frontendVars.IS_PRODUCTION) {
    serviceWorker.register()
} else {
    serviceWorker.unregister()
}
