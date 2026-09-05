import { Fragment } from "react";

const createItems = (count) => Array.from({ length: count }, (_, index) => index);

function Skeleton({ className = "" }) {
  return <span className={`public-skeleton ${className}`} aria-hidden="true" />;
}

function LoadingLabel({ children = "Memuat konten" }) {
  return <span className="sr-only">{children}</span>;
}

export function ProjectCardsSkeleton({ count = 4 }) {
  return (
    <Fragment>
      <LoadingLabel>Memuat daftar proyek</LoadingLabel>
      {createItems(count).map((item) => (
        <article key={item} className="border border-ink/12 bg-ink/[0.025]">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-4 p-5 md:p-6">
            <Skeleton className="h-7 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </article>
      ))}
    </Fragment>
  );
}

export function AchievementRowsSkeleton({ count = 4, page = false }) {
  if (page) {
    return (
      <Fragment>
        <LoadingLabel>Memuat dokumentasi achievement</LoadingLabel>
        {createItems(Math.min(count, 3)).map((item) => (
          <article key={item} className="achievement-doc">
            <div className="achievement-doc-marker">
              <Skeleton className="h-5 w-7" />
            </div>
            <div className="achievement-doc-body space-y-5">
              <Skeleton className="h-8 w-3/5" />
              <Skeleton className="h-4 w-2/5" />
              <div className="grid gap-3 md:grid-cols-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
              </div>
            </div>
          </article>
        ))}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <LoadingLabel>Memuat daftar achievement</LoadingLabel>
      {createItems(count).map((item) => (
        <div key={item} className="grid grid-cols-1 gap-3 border-b border-ink/10 py-5 md:grid-cols-12 md:items-center">
          <div className="space-y-2 md:col-span-4">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-4 w-3/4 md:col-span-3" />
          <div className="space-y-2 md:col-span-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-24 md:col-span-2" />
        </div>
      ))}
    </Fragment>
  );
}

export function TeamCardsSkeleton({ count = 3, isPage = false }) {
  if (isPage) {
    return (
      <Fragment>
        <LoadingLabel>Memuat profil anggota team</LoadingLabel>
        {createItems(count).map((item) => (
          <div key={item} className="flex justify-center w-full">
            <article
              className="relative aspect-[0.718] w-full max-w-[388px] rounded-[30px] border border-ink/10 bg-ink/[0.04] p-5 shadow-2xl overflow-hidden flex flex-col justify-between"
              style={{ height: "80svh", maxHeight: "540px" }}
            >
              <div className="pt-6 flex flex-col items-center gap-2.5">
                <Skeleton className="h-6 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/3 rounded-full" />
              </div>
              <div className="flex justify-center items-center py-6">
                <Skeleton className="w-24 h-24 rounded-full opacity-30" />
              </div>
              <div className="rounded-[20px] border border-ink/10 bg-ink/[0.04] p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-20 rounded" />
                    <Skeleton className="h-2.5 w-12 rounded" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </article>
          </div>
        ))}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <LoadingLabel>Memuat anggota team</LoadingLabel>
      {createItems(count).map((item) => (
        <article key={item} className="border border-ink/12 bg-ink/[0.025] p-3">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="space-y-3 px-2 pb-3 pt-5">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        </article>
      ))}
    </Fragment>
  );
}

export function ProcessRowsSkeleton({ count = 4 }) {
  return (
    <Fragment>
      <LoadingLabel>Memuat tahapan proses</LoadingLabel>
      {createItems(count).map((item) => (
        <div key={item} className="grid gap-5 border-b border-ink/10 py-7 md:grid-cols-12 md:gap-8">
          <Skeleton className="h-7 w-12 md:col-span-2" />
          <Skeleton className="h-6 w-4/5 md:col-span-3" />
          <div className="space-y-2 md:col-span-7">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-10/12" />
          </div>
        </div>
      ))}
    </Fragment>
  );
}

export function ProjectArchiveSkeleton() {
  return (
    <main className="min-h-screen bg-[#070A08] pt-24 pb-16 md:pt-28 md:pb-20 text-[#F8F5EC] flex flex-col justify-center" aria-busy="true">
      <LoadingLabel>Memuat galeri proyek</LoadingLabel>
      <section className="section-wrapper w-full">
        {/* Title area skeleton */}
        <div className="mb-8 md:mb-12 max-w-5xl space-y-3">
          <Skeleton className="h-4 w-44 rounded-sm" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-10 md:h-14 w-3/4 max-w-lg rounded-sm" />
            <Skeleton className="h-10 md:h-14 w-1/2 max-w-sm rounded-sm" />
          </div>
        </div>

        {/* Accordion Gallery skeleton (5 vertical panels) */}
        <div className="flex h-[420px] md:h-[550px] w-full gap-3 md:gap-[14px]">
          {/* Expanded panel */}
          <div className="relative flex-[5] overflow-hidden rounded-[16px] border border-ink/10 bg-ink/[0.03]">
            <Skeleton className="h-full w-full rounded-[16px]" />
            <div className="absolute bottom-6 left-6 space-y-2">
              <Skeleton className="h-3 w-32 rounded-sm" />
              <Skeleton className="h-6 w-48 rounded-sm" />
            </div>
          </div>
          {/* Collapsed panels */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-[1] overflow-hidden rounded-[16px] border border-ink/10 bg-ink/[0.03]">
              <Skeleton className="h-full w-full rounded-[16px]" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#070a08] px-5 pb-20 pt-28 text-[#f8f5ec] md:px-10 md:pt-32" aria-busy="true">
      <LoadingLabel>Memuat detail proyek</LoadingLabel>
      <div className="mx-auto max-w-[1440px]">
        <Skeleton className="h-4 w-32" />
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="space-y-5 lg:col-span-8">
            <Skeleton className="h-14 w-4/5 md:h-20" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-3 lg:col-span-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <Skeleton className="mt-12 aspect-video w-full" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </main>
  );
}

export function DocumentationSkeleton({ proposal = false }) {
  return (
    <main className="min-h-screen bg-[#070a08] px-5 pb-20 pt-28 text-[#f8f5ec] md:px-10 md:pt-32" aria-busy="true">
      <LoadingLabel>{proposal ? "Memuat proposal" : "Memuat dokumentasi"}</LoadingLabel>
      <div className="mx-auto max-w-[1180px]">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-7 h-12 w-3/4 md:h-16" />
        <Skeleton className="mt-5 h-4 w-1/2" />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {createItems(proposal ? 2 : 3).map((item) => (
              <div key={item} className="space-y-4 border-t border-ink/10 pt-7">
                <Skeleton className="h-7 w-2/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full lg:col-span-4" />
        </div>
      </div>
    </main>
  );
}
