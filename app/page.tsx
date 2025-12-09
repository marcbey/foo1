import GridStackDemo from "./components/GridStackDemo";
import ChartsDemo from "./components/ChartsDemo";

const navItems = [
  { label: "Overview", active: true },
  { label: "Projects", active: false },
  { label: "Reports", active: false },
  { label: "Settings", active: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold uppercase tracking-wide text-white">
              F1
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Workspace
              </p>
              <p className="text-base font-semibold text-slate-900">
                Product Dashboard
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#">
              Updates
            </a>
            <a className="hover:text-slate-900" href="#">
              Support
            </a>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
              New Entry
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <aside className="w-64 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Navigation
            </p>
            <nav className="mt-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "border border-indigo-100 bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  href="#"
                >
                  {item.label}
                  {item.active ? (
                    <span className="text-xs font-semibold uppercase text-indigo-600">
                      Active
                    </span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-700 shadow-sm">
            <p className="font-semibold text-slate-900">Create something new</p>
            <p className="mt-1 text-slate-600">
              Capture ideas, track tasks, or map the next release in seconds.
            </p>
            <button className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-100">
              Start a draft
            </button>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <GridStackDemo />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ChartsDemo />
          </section>
        </main>
      </div>
    </div>
  );
}
