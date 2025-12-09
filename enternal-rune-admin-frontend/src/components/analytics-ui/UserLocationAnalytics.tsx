"use client";
import React from "react";
import Image from "next/image";
import CountryMap from "@/components/ecommerce/CountryMap";
import { useLocationStats } from "@/hooks/useAnalytics";

type CountryData = {
  name: string;
  code: string;
  flag: string;
  users: number;
  percentage: number;
  trend: number;
};

const countryData: CountryData[] = [
  {
    name: "Việt Nam",
    code: "VN",
    flag: "/images/country/vietnam.svg",
    users: 18234,
    percentage: 74.2,
    trend: 12.5,
  },
  {
    name: "United States",
    code: "US",
    flag: "/images/country/usa.svg",
    users: 2456,
    percentage: 10.0,
    trend: 8.3,
  },
  {
    name: "Japan",
    code: "JP",
    flag: "/images/country/japan.svg",
    users: 1567,
    percentage: 6.4,
    trend: -2.1,
  },
  {
    name: "South Korea",
    code: "KR",
    flag: "/images/country/south-korea.svg",
    users: 1234,
    percentage: 5.0,
    trend: 5.7,
  },
  {
    name: "Khác",
    code: "OTHER",
    flag: "",
    users: 1076,
    percentage: 4.4,
    trend: 3.2,
  },
];

interface UserLocationAnalyticsProps {
  websiteId?: string;
}

export default function UserLocationAnalytics({ websiteId }: UserLocationAnalyticsProps) {
  const { data: locationStats, loading, error } = useLocationStats(websiteId);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Phân bố người dùng theo vị trí
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Số lượng người dùng phân chia theo quốc gia
          </p>
        </div>
        <div className="p-6">
          <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu vị trí: {error}</p>
      </div>
    );
  }

  // Use real data if available
  const countries = locationStats || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Phân bố người dùng theo vị trí
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Số lượng người dùng phân chia theo quốc gia
        </p>
      </div>

      {/* Map */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <div className="h-[400px] w-full">
          <CountryMap />
        </div>
      </div>

      {/* Country List */}
      <div className="p-6">
        <div className="space-y-4">
          {countries.map((country: CountryData | { country: string; countryCode: string; users: number; percentage: number; trend: number }, index: number) => {
            // Map country names to flag paths
            const flagMap: { [key: string]: string } = {
              'Vietnam': '/images/country/vietnam.svg',
              'Việt Nam': '/images/country/vietnam.svg',
              'United States': '/images/country/usa.svg',
              'Japan': '/images/country/japan.svg',
              'South Korea': '/images/country/south-korea.svg',
              'United Kingdom': '/images/country/uk.svg',
              'Germany': '/images/country/germany.svg',
              'France': '/images/country/france.svg',
              'Canada': '/images/country/canada.svg'
            };

            // Type-safe property access
            const countryName = 'country' in country ? country.country : country.name;
            const countryCode = 'countryCode' in country ? country.countryCode : country.code;
            const flagPath = flagMap[countryName] || ('flag' in country ? country.flag : '');
            const userCount = 'users' in country ? country.users : 0;
            const displayPercentage = 'percentage' in country ? country.percentage : 0;
            const trendValue = 'trend' in country ? country.trend : 0;
            
            return (
            <div
              key={`${countryCode}-${index}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-gray-900">
                  {flagPath ? (
                    <Image
                      src={flagPath}
                      alt={countryName}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {countryName}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userCount.toLocaleString()} người dùng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {displayPercentage}%
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    {trendValue >= 0 ? (
                      <>
                        <svg
                          className="h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        <span className="text-green-600 dark:text-green-400">
                          {trendValue.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                        <span className="text-red-600 dark:text-red-400">
                          {Math.abs(trendValue).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-24">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-brand-500 dark:bg-brand-600"
                      style={{ width: `${Math.min(displayPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
