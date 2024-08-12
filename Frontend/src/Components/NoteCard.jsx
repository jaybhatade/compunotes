// Note Card Component
const NoteCard = ({ title, date, content }) => (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{date}</div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 transition-colors duration-200">{content}</p>
    </div>
  );

  export default NoteCard