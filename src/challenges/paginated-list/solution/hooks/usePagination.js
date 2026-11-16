import { useState } from "react";

export default function usePagination(items, pageSize) {
  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  // Derive the page instead of syncing it with an effect: if the stored page
  // no longer exists (fewer items / bigger pages), fall back to the last one.
  const page = Math.min(Math.max(requestedPage, 1), totalPages);

  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  const goTo = (n) => setRequestedPage(Math.min(Math.max(n, 1), totalPages));

  return {
    page,
    totalPages,
    pageItems,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    prev: () => goTo(page - 1),
    next: () => goTo(page + 1),
    goTo,
  };
}
