import { Avatar, AvatarFallback } from '@ui-sdk/react/avatar'

export default function AvatarPreview() {
  return (
    <div className="sdk-row">
      {['Tony App', 'Ada Lovelace', 'Grace Hopper'].map((name) => (
        <Avatar key={name} aria-label={name} className="sdk-avatar" data-design-surface>
          <AvatarFallback>
            {name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
