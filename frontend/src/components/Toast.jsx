export default function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast ${type}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {message}
    </div>
  );
}
