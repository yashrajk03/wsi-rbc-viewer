function LeftPanel({ patientId, sampleType, date, rbcCount, theme, toggleTheme }) {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg m-4 text-gray-800 dark:text-gray-200">
        <h2 className="text-xl font-bold mb-4 text-primary dark:text-secondary">Finding Details</h2>
        <p className="mb-2"><span className="font-semibold">Patient ID:</span> {patientId}</p>
        <p className="mb-2"><span className="font-semibold">Sample Type:</span> {sampleType || 'N/A'}</p>
        <p className="mb-2"><span className="font-semibold">Date:</span> {date || 'N/A'}</p>
        <p className="mb-4"><span className="font-semibold">Detected RBCs:</span> {rbcCount}</p>
        <button
          onClick={toggleTheme}
          className="w-full py-2 bg-primary dark:bg-secondary text-white rounded-md hover:bg-indigo-700 dark:hover:bg-emerald-700 transition-colors"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    );
  }
  
  export default LeftPanel;