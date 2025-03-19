function ZoomControls({ zoomIn, zoomOut, reset, theme }) {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button
        onClick={() => zoomIn()}
        className="px-3 py-1 bg-primary dark:bg-secondary text-white rounded-full hover:bg-indigo-700 dark:hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
      >
        +
      </button>
      <button
        onClick={() => zoomOut()}
        className="px-3 py-1 bg-primary dark:bg-secondary text-white rounded-full hover:bg-indigo-700 dark:hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
      >
        -
      </button>
      <button
        onClick={() => reset()}
        className="px-3 py-1 bg-primary dark:bg-secondary text-white rounded-full hover:bg-indigo-700 dark:hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
      >
        Reset
      </button>
    </div>
  );
}

export default ZoomControls;