const DEFAULT_SITE_URL = "https://spirospares.pages.dev";

export const getSiteUrl = (): string => {
  const rawValue =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.CF_PAGES_URL?.trim() ||
    DEFAULT_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : `https://${rawValue}`;

  return withProtocol.replace(/\/+$/, "");
};