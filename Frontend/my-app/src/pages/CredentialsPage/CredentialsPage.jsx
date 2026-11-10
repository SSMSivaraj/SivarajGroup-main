import InnerPage from '../KnowUsBetter/InnerPage.jsx'

export default function CredentialsPage({ rewards = false }) {
  return <InnerPage config={{ pageCode: rewards ? 'CREDENTIALS_REWARDS' : 'CREDENTIALS_CERTIFICATIONS' }} />
}
