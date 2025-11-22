
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found">
      <div className="error-page-content">
        <div className="error-icon">😕</div>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  )
}

export default NotFound