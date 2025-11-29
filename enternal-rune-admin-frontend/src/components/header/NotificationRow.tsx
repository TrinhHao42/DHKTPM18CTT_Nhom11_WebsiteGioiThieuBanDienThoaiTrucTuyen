"use client";

import Image from "next/image";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { DisplayNotification } from "@/types/Notification";

interface Props {
  item: DisplayNotification;
  onClick: () => void;
}

export function NotificationRow({ item, onClick }: Props) {
  // Default to success status for order notifications
  const statusColor = "bg-success-500";

  return (
    <DropdownItem
      onItemClick={onClick}
      className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
    >
      <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
        <Image
          width={40}
          height={40}
          src={item.user.avatar || "/images/user/owner.jpg"}
          alt={item.user.name}
          className="w-full overflow-hidden rounded-full"
        />
        <span
          className={`absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 ${statusColor}`}
        ></span>
      </span>

      <span className="block">
        <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-800 dark:text-white/90">
            {item.user.name}
          </span>
          <span>{item.message}</span>
        </span>

        <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{item.time}</span>
        </span>
      </span>
    </DropdownItem>
  );
}
