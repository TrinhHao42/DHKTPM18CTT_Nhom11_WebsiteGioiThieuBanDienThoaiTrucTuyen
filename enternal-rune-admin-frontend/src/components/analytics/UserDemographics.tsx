"use client";
import React from "react";

type AgeGroup = {
  range: string;
  count: number;
  percentage: number;
  color: string;
};

const ageGroups: AgeGroup[] = [
  { range: "18-24", count: 5678, percentage: 23.1, color: "bg-brand-500" },
  { range: "25-34", count: 9234, percentage: 37.6, color: "bg-brand-600" },
  { range: "35-44", count: 6123, percentage: 24.9, color: "bg-brand-400" },
  { range: "45-54", count: 2456, percentage: 10.0, color: "bg-brand-300" },
  { range: "55+", count: 1076, percentage: 4.4, color: "bg-brand-200" },
];

type Gender = {
  label: string;
  count: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
};

const genderData: Gender[] = [
  {
    label: "Nam",
    count: 13456,
    percentage: 54.8,
    color: "bg-brand-500",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: "Nữ",
    count: 10234,
    percentage: 41.7,
    color: "bg-brand-400",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: "Khác",
    count: 877,
    percentage: 3.5,
    color: "bg-brand-300",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function UserDemographics() {
  const maxPercentage = Math.max(...ageGroups.map((g) => g.percentage));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Nhân khẩu học người dùng
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Phân tích độ tuổi và giới tính người dùng
        </p>
      </div>

      {/* Gender Distribution */}
      <div className="mb-8">
        <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Phân bố giới tính
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {genderData.map((gender) => (
            <div
              key={gender.label}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${gender.color} text-white`}
                  >
                    {gender.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {gender.label}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {gender.count.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {gender.percentage}%
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full ${gender.color}`}
                  style={{ width: `${gender.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Age Distribution */}
      <div>
        <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Phân bố độ tuổi
        </h4>
        <div className="space-y-4">
          {ageGroups.map((group) => (
            <div
              key={group.range}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white dark:bg-gray-900">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {group.range}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Độ tuổi
                    </p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {group.count.toLocaleString()} người
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {group.percentage}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full ${group.color} transition-all duration-500`}
                  style={{ width: `${group.percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-semibold text-white">
                    {group.percentage >= 15 && `${group.percentage}%`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-brand-600 dark:bg-gray-900 dark:text-brand-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Nhóm đông nhất
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                25-34 tuổi
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-brand-600 dark:bg-gray-900 dark:text-brand-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Độ tuổi trung bình
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                32 tuổi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
