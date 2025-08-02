export default function FeaturesPage() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.32))]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Text to Speech</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Convert any text into natural-sounding speech with our advanced AI technology.
            </p>
          </div>
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Multiple Voices</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose from a variety of voices and accents to suit your needs.
            </p>
          </div>
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Custom Speed</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Adjust the speaking speed to match your preferences.
            </p>
          </div>
          <div className="p-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Export Options</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Download your audio in multiple formats including MP3 and WAV.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 