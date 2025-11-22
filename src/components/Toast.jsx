
function Toast({ message, type, onClose }) {
  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      {message}
    </div>
  )
}

export default Toast
