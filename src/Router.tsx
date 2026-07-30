import { useEffect, useState } from 'react'

import App from './App'
import WeiterbildungPage from './pages/WeiterbildungPage'
import { applyRouteSeo, homeSeo, weiterbildungSeo, type RouteSeo } from './seo'

type Route = {
  component: () => React.JSX.Element
  seo: RouteSeo
}

const routes: Record<string, Route> = {
  '/': { component: App, seo: homeSeo },
  '/ubtesting1': { component: WeiterbildungPage, seo: weiterbildungSeo },
}

/** Collapses trailing slashes and casing so `/UBTesting1/` resolves like `/ubtesting1`. */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '').toLowerCase()

  return trimmed === '' ? '/' : trimmed
}

export function resolveRoute(pathname: string): Route {
  return routes[normalizePath(pathname)] ?? routes['/']
}

export default function Router() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const route = resolveRoute(pathname)

  useEffect(() => {
    applyRouteSeo(route.seo)
  }, [route.seo])

  const Page = route.component

  return <Page />
}
