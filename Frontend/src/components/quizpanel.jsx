function QuizPanel({ quiz }) {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-sky-50 rounded-xl border border-sky-200/50">
      {quiz.map((q, i) => (
        <div key={i} className="mb-6 p-4 bg-white rounded-lg border border-sky-100/50 hover:border-sky-300/50 transition-all">
          <h3 className="font-semibold text-sky-800 mb-3">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((opt, j) => (
              <div key={j} className="p-2 bg-sky-50 rounded-lg text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer border border-sky-200/30 hover:border-sky-300/50">
                {opt}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuizPanel;