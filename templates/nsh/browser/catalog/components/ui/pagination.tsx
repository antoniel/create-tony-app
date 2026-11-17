import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@ui-sdk/react/pagination'

export default function PaginationPreview() {
  return (
    <Pagination total={30} pageSize={10} defaultPage={1} aria-label="Preview pages">
      <PaginationList className="sdk-row sdk-list">
        <PaginationPrevious className="sdk-button" aria-label="Previous page">
          ‹
        </PaginationPrevious>
        {[1, 2, 3].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink className="sdk-button" page={page}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext className="sdk-button" aria-label="Next page">
          ›
        </PaginationNext>
      </PaginationList>
    </Pagination>
  )
}
