"use client";

const GlobalError = ({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">
              Unexpected error
            </p>
            <h1 className="mt-5 text-4xl font-bold">Something went wrong</h1>
            <p className="mt-4 text-slate-300">
              Retry the page to continue shopping.
            </p>
            <button
              className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-slate-950"
              onClick={() => unstable_retry()}
              type="button"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
