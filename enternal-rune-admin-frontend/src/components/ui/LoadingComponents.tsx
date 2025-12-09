import React from "react";

export function LoadingSpinner({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-brand-600 dark:border-gray-600 dark:border-t-brand-400 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}

export function ChartLoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 animate-pulse">
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-2 h-4 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex justify-center">
        <div className="h-[350px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export function MetricLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="mt-2 h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-start gap-3">
        <svg className="h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <p className="text-red-800 dark:text-red-200">Lỗi tải dữ liệu</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-white/[0.03]">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v4h2a2 2 0 012 2z" />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}