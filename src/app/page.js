export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Hello Tools 🛠️
        </h1>
        <p className="text-xl text-gray-600">
          간단한 도구들을 모아놓은 사이트입니다.
        </p>
        <p className="text-sm text-gray-400">
          곧 유용한 계산기들이 추가됩니다.
        </p>
        <div className="mt-8 flex gap-4">
          <span className="rounded-full bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
            준비 중...
          </span>
        </div>
      </main>
    </div>
  );
}
