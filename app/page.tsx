import LandingPage from '@/components/LandingPage'

const TEAM_PHOTOS = {
  tsotne: '/team/tsotne.jpg',
  davit: '/team/davit.jpg',
  levan: '/team/levan.jpg',
}

export default function Page() {
  return <LandingPage photos={TEAM_PHOTOS} />
}
