import { Rating, RatingItem } from '@ui-sdk/react/rating'

export default function RatingPreview() {
  return (
    <Rating aria-label="Rate this preview" defaultValue={3} max={5} className="sdk-row">
      <RatingItem className="sdk-star">{({ fill }) => (fill ? '★' : '☆')}</RatingItem>
    </Rating>
  )
}
