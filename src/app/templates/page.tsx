export default function TemplatesPage() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.32))]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Templates</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Story Narration</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Perfect for audiobooks and storytelling with natural pacing and expression.
            </p>
          </div>
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Business Presentation</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Professional voice templates for corporate presentations and reports.
            </p>
          </div>
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Educational Content</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Clear and engaging voices for educational materials and tutorials.
            </p>
          </div>
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Marketing Script</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Energetic and persuasive voices for marketing and advertising content.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 