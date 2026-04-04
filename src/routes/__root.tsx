import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'UN Votes' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)' }}>
        <header
          style={{
            borderBottom: '1px solid #e0e0e0',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <Link
            to="/"
            style={{ fontWeight: 600, fontSize: '15px', textDecoration: 'none', color: '#111' }}
          >
            UN Votes
          </Link>
          <nav style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
            <Link
              to="/ga"
              style={{ textDecoration: 'none', color: '#555' }}
              activeProps={{ style: { color: '#111', textDecoration: 'underline' } }}
            >
              General Assembly
            </Link>
            <Link
              to="/sc"
              style={{ textDecoration: 'none', color: '#555' }}
              activeProps={{ style: { color: '#111', textDecoration: 'underline' } }}
            >
              Security Council
            </Link>
          </nav>
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          {children}
        </main>
        <Scripts />
      </body>
    </html>
  )
}
