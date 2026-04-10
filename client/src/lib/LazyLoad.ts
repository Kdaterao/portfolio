




export function LazyLoad<T>( fetchData: (() => T | Promise<T>) | Promise<T>, element: HTMLElement ): Promise<T> {
  let rootMargin = "100px";
  let threshold = 0.01;

  return new Promise<T>((resolve, reject) => {
    let loading = false;
    let done = false;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting || loading || done) return;

        loading = true;
        done = true;

        observer.disconnect();

        try {
          let result: T;

          if (typeof fetchData === "function") {
            result = await fetchData();
          } else {
            result = await fetchData;
          }

          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);
  });
}







