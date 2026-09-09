import { Zap } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F7F8F7]">
      <div className="grid h-screen max-h-screen lg:grid-cols-[1.35fr_1fr] bg-[#171A18] ">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(141,246,136,0.12),transparent_35%)]" />
        <section className="relative hidden h-screen overflow-hidden pl-20  lg:flex">
          <div className="relative flex h-full w-full items-center p-10 xl:p-14">
            <div className="w-full">
              <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8DF688] text-[#171A18]">
              <Zap className="h-6 w-6 fill-current stroke-none" />
            </div>

                <span className="text-xl font-bold tracking-tight text-white">
                  TeamPulse
                </span>
              </div>

              <div className="mt-12 max-w-xl">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                  Keep your team aligned.
                  <span className="block text-[#8DF688]">
                    Keep progress visible.
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#B7BDB9] xl:text-base">
                  TeamPulse brings weekly reporting, project progress, team
                  activity, and manager reviews together in one simple
                  workspace.
                </p>
              </div>

              <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-bold text-white">Weekly Reports</p>
                  <p className="mt-1 text-xs leading-5 text-[#9FA6A1]">
                    Track progress, achievements, and blockers.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-bold text-white">
                    Project Visibility
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#9FA6A1]">
                    See what's happening across your projects.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-bold text-white">Team Reviews</p>
                  <p className="mt-1 text-xs leading-5 text-[#9FA6A1]">
                    Review submissions and keep teams accountable.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-xs text-[#737B76]">
                A focused workspace for teams that value clarity, consistency,
                and progress.
              </p>
            </div>
          </div>
        </section>

        <main className="z-50 flex h-screen max-h-screen items-center justify-center overflow-hidden bg-[#171A18] px-5 py-8 sm:px-8 lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171A18] text-sm font-black text-[#8DF688]">
                T
              </div>

              <span className="text-lg font-bold text-[#171A18]">
                TeamPulse
              </span>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
