import { createClient, type QueryParams } from "@sanity/client";

type SanityFetchOptions = {
  perspective?: "published" | "previewDrafts";
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-15";
const token = process.env.SANITY_API_READ_TOKEN;

export const hasSanityConfig = Boolean(projectId && dataset);

const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
      perspective: "published"
    })
  : null;

export async function sanityFetch<T>(query: string, params: QueryParams = {}, options: SanityFetchOptions = {}) {
  if (!sanityClient) {
    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params, {
      perspective: options.perspective ?? "published"
    });
  } catch {
    return null;
  }
}
