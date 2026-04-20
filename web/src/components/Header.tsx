import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="site-header">
      <nav
        className="page-wrap"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '0.9rem 0',
        }}
      >
        <Link to="/" className="site-logo">
          UN Votes
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className="nav-link"
            activeOptions={{ exact: true }}
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          <Link
            to="/ga"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            General Assembly
          </Link>
          <Link
            to="/sc"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Security Council
          </Link>
        </div>
      </nav>
    </header>
  )
}
