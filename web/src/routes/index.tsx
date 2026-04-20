import { createFileRoute, Link } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="page-wrap home-hero fade-in">
      <Card className="mb-6 border-primary/20 bg-white/85 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="home-title mb-1">
            United Nations Voting Records
          </CardTitle>
          <CardDescription className="home-subtitle m-0 max-w-3xl text-sm md:text-base">
            Explore resolution outcomes and country-level voting behavior in the
            General Assembly and Security Council.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="home-links grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/ga" className="no-underline">
          <Card className="home-card h-full border-primary/20 bg-white/90 transition-transform hover:-translate-y-0.5">
            <CardHeader>
              <div className="home-card-label">Body</div>
              <CardTitle className="home-card-title">
                General Assembly
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="home-card-arrow">Open voting records &rarr;</div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/sc" className="no-underline">
          <Card className="home-card h-full border-primary/20 bg-white/90 transition-transform hover:-translate-y-0.5">
            <CardHeader>
              <div className="home-card-label">Body</div>
              <CardTitle className="home-card-title">
                Security Council
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="home-card-arrow">Open voting records &rarr;</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  )
}
