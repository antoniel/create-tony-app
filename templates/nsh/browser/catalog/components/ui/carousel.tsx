import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from '@ui-sdk/react/carousel'

export default function CarouselPreview() {
  return (
    <Carousel aria-label="Design steps" className="sdk-stack sdk-carousel">
      <CarouselViewport>
        <CarouselContent>
          {['Discover', 'Design', 'Deliver'].map((name) => (
            <CarouselItem className="sdk-panel" key={name}>
              {name}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div className="sdk-row">
        <CarouselPrevious className="sdk-button">Previous</CarouselPrevious>
        <CarouselNext className="sdk-button">Next</CarouselNext>
      </div>
    </Carousel>
  )
}
