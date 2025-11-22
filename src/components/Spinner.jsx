
function Spinner({ size = 'medium' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner"></div>
    </div>
  )
}

export default Spinner