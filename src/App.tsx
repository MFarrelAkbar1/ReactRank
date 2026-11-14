import { Route, Routes } from 'react-router-dom'
import ChallengeList from './pages/ChallengeList'
import ChallengePage from './pages/ChallengePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChallengeList />} />
      <Route path="/challenge/:slug" element={<ChallengePage />} />
      <Route path="*" element={<ChallengeList />} />
    </Routes>
  )
}
