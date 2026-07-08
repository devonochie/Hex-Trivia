import { useEffect } from "react";

/**
 * Sets document.title for the current page.
 *
 * TanStack Router's `head()` option managed <title> and <meta> tags per
 * route. react-router-dom has no built-in equivalent, so page-level meta
 * now lives in index.html (static tags) plus this hook for the dynamic
 * <title>. If you need per-route <meta> tags (og:title, description, etc.)
 * too, consider adding `react-helmet-async` and swapping this hook for
 * a <Helmet> usage instead.
 */
export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let metaDescription: HTMLMetaElement | null = null;
    let prevDescription: string | null = null;

    if (description) {
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        prevDescription = metaDescription.getAttribute("content");
        metaDescription.setAttribute("content", description);
      }
    }

    return () => {
      document.title = prevTitle;
      if (metaDescription && prevDescription !== null) {
        metaDescription.setAttribute("content", prevDescription);
      }
    };
  }, [title, description]);
}
