import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
          404
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight">
          We could not find that page
        </h1>
        <p className="mx-auto mt-4 max-w-md text-slate-300">
          The product or order may no longer exist, or the address may be
          incorrect.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-indigo-50"
          href="/"
        >
          Return home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
