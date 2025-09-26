import { useMemo, useState } from "react";

// === App: Trắc nghiệm 4 lựa chọn (chỉ 1 đáp án đúng) ===
// - TailwindCSS ready
// - Có chấm điểm, hiển thị đúng/sai, thanh tiến độ, và màn hình kết quả
// - Dễ tuỳ biến: chỉ cần sửa mảng `QUESTION_BANK`

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Quiz />
      </main>
      <Footer />
    </div>
  );
}

// ====== DATA MẪU ======
// Bạn chỉ cần thay nội dung câu hỏi/đáp án ở đây
const QUESTION_BANK = [
  {
    id: 1,
    prompt: "Chọn nghĩa đúng của từ 'achievement'",
    options: [
      { id: "A", text: "Sự cố gắng" },
      { id: "B", text: "Thành tựu" },
      { id: "C", text: "Thất bại" },
      { id: "D", text: "Cảm hứng" },
    ],
    correctId: "B",
    explain: "'Achievement' nghĩa là thành tựu, điều đạt được sau nỗ lực.",
  },
  {
    id: 2,
    prompt: "Chọn câu dùng thì hiện tại hoàn thành",
    options: [
      { id: "A", text: "I eat breakfast now." },
      { id: "B", text: "I will eat breakfast." },
      { id: "C", text: "I have eaten breakfast." },
      { id: "D", text: "I was eating breakfast." },
    ],
    correctId: "C",
    explain: "Hiện tại hoàn thành: have/has + V3 (eaten).",
  },
  {
    id: 3,
    prompt: "Từ trái nghĩa với 'difficult' là gì?",
    options: [
      { id: "A", text: "Hard" },
      { id: "B", text: "Complicated" },
      { id: "C", text: "Easy" },
      { id: "D", text: "Tough" },
    ],
    correctId: "C",
    explain: "Antonym của 'difficult' là 'easy'.",
  },
];

function Quiz() {
  // Có thể shuffle một lần khi mount nếu muốn ngẫu nhiên thứ tự câu hỏi
  const questions = useMemo(() => QUESTION_BANK, []);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // id đáp án đang chọn
  const [locked, setLocked] = useState(false); // đã chấm câu này chưa
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const total = questions.length;
  const progress = Math.round(((index + (locked || done ? 1 : 0)) / total) * 100);

  function submitAnswer() {
    if (selected == null) return; // chưa chọn thì không cho nộp
    if (locked) return; // đã chấm thì không chấm lại

    setLocked(true);
    if (selected === q.correctId) setScore((s) => s + 1);
  }

  function nextQuestion() {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setDone(false);
  }

  if (done) return <Result score={score} total={total} onRestart={restart} />;

  return (
    <div className="space-y-4">
      {/* Thanh tiến độ */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
          <span>Câu {index + 1}/{total}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Nội dung câu hỏi */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="text-sm text-neutral-500">Câu hỏi {index + 1}</div>
        <h2 className="mt-1 text-lg font-bold">{q.prompt}</h2>

        <ul className="mt-4 space-y-3">
          {q.options.map((op) => {
            const isSelected = selected === op.id;
            const isCorrect = locked && op.id === q.correctId;
            const isWrong = locked && isSelected && op.id !== q.correctId;

            return (
              <li key={op.id}>
                <button
                  disabled={locked}
                  onClick={() => setSelected(op.id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                    "hover:border-indigo-400 hover:bg-indigo-50",
                    isSelected && !locked && "border-indigo-500 bg-indigo-50",
                    isCorrect && "border-emerald-500 bg-emerald-50",
                    isWrong && "border-rose-500 bg-rose-50",
                    locked && !isSelected && !isCorrect && "opacity-70",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span
                    className={[
                      "grid h-8 w-8 place-items-center rounded-full border text-sm font-semibold",
                      isCorrect && "border-emerald-500 text-emerald-700",
                      isWrong && "border-rose-500 text-rose-700",
                      isSelected && !locked && "border-indigo-500 text-indigo-700",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {op.id}
                  </span>
                  <span className="text-sm">{op.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Feedback + nút điều hướng */}
        <div className="mt-4 flex items-center justify-between">
          <div className="min-h-[24px] text-sm">
            {locked && (
              <span className={q.correctId === selected ? "text-emerald-700" : "text-rose-700"}>
                {q.correctId === selected ? "Chính xác!" : "Chưa đúng."}
                {q.explain ? ` ${q.explain}` : ""}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!locked ? (
              <button
                onClick={submitAnswer}
                disabled={selected == null}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Nộp bài
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="rounded-lg border px-5 py-2 text-sm font-semibold hover:bg-neutral-50"
              >
                {index + 1 < total ? "Câu tiếp theo" : "Xem kết quả"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Thanh điểm nhanh */}
      <div className="text-center text-sm text-neutral-600">
        Điểm hiện tại: <span className="font-semibold text-indigo-700">{score}</span> / {total}
      </div>
    </div>
  );
}

function Result({ score, total, onRestart }) {
  const percent = Math.round((score / total) * 100);
  let color = "text-neutral-800";
  if (percent >= 80) color = "text-emerald-700";
  else if (percent >= 50) color = "text-amber-700";
  else color = "text-rose-700";

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 text-center shadow-sm">
      <div className="text-sm text-neutral-500">Hoàn thành bài trắc nghiệm</div>
      <h2 className="mt-1 text-2xl font-extrabold">Kết quả của bạn</h2>

      <div className="mx-auto mt-4 w-full max-w-md">
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${percent}%` }} />
        </div>
        <div className={`mt-2 text-lg font-bold ${color}`}>{percent}% đúng</div>
        <div className="text-sm text-neutral-600">
          ({score} / {total} câu)
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button onClick={onRestart} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">
          Làm lại
        </button>
        <button className="rounded-lg border px-5 py-2 text-sm font-semibold hover:bg-neutral-50">
          Xem giải thích chi tiết
        </button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-indigo-600 px-2 py-1 text-white">
            <span className="text-sm font-extrabold">EL</span>
          </div>
          <span className="text-sm font-bold">EnglishLearn • Quiz</span>
        </div>
        <a className="text-sm text-indigo-600 hover:underline" href="#">Trang chủ</a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} EnglishLearn • Trắc nghiệm 4 đáp án
      </div>
    </footer>
  );
}
