import Notice from './Notice'
import Button from './Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="space-y-4">
      <Notice>{message}</Notice>
      {onRetry && <Button variant="ghost" onClick={onRetry}>Try again</Button>}
    </div>
  )
}