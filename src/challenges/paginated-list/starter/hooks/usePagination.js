import { useState } from "react";

// usePagination(items, pageSize)
//
// Returns:
//   page        current page, 1-based
//   totalPages  number of pages (at least 1, even when items is empty)
//   pageItems   the items on the current page
//   hasPrev     true when there is a previous page
//   hasNext     true when there is a next page
//   prev()      go to the previous page (does nothing on the first page)
//   next()      go to the next page (does nothing on the last page)
//   goTo(n)     go to page n, clamped between 1 and totalPages
//
// If `items` or `pageSize` change and the current page no longer exists,
// the hook must return the last page that does exist.
export default function usePagination(items, pageSize) {
  const [page, setPage] = useState(1);

  // TODO: implement the hook
  return {
    page,
    totalPages: 1,
    pageItems: items,
    hasPrev: false,
    hasNext: false,
    prev: () => {},
    next: () => {},
    goTo: () => {},
  };
}
