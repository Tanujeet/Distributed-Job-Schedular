export async function fetcher<T>(path: string): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  console.log("FETCH URL:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
}
