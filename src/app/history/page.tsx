export default function HistoryPage() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.32))]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">History</h1>
        <div className="space-y-6">
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">Project Presentation</h2>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A business presentation converted to speech using the professional voice template.
            </p>
            <div className="flex space-x-4">
              <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline">
                Play Again
              </button>
              <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 hover:underline">
                Download
              </button>
            </div>
          </div>

          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">Story Chapter 1</h2>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              First chapter of a novel using the storyteller voice template.
            </p>
            <div className="flex space-x-4">
              <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline">
                Play Again
              </button>
              <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 hover:underline">
                Download
              </button>
            </div>
          </div>

          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">Tutorial Script</h2>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Educational content using the clear instructional voice.
            </p>
            <div className="flex space-x-4">
              <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline">
                Play Again
              </button>
              <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 hover:underline">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 