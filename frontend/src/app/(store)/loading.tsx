const StoreLoading = () => {
  return (
    <div className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-6 py-12 lg:px-8">
      <div className="h-4 w-28 rounded-full bg-indigo-100" />
      <div className="mt-4 h-10 w-72 max-w-full rounded-2xl bg-slate-200" />
      <div className="mt-4 h-5 w-96 max-w-full rounded-full bg-slate-100" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
            key={index}
          >
            <div className="aspect-[4/3] bg-slate-100" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 rounded-full bg-indigo-100" />
              <div className="h-5 w-2/3 rounded-full bg-slate-200" />
              <div className="h-4 w-full rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreLoading;
