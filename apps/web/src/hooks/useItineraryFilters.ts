import { useState } from "react";
import type { ItineraryItemResponse, ItineraryItemType, ItineraryStatus } from "@itinavi/schema";

export function useItineraryFilters(items: ItineraryItemResponse[]) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredItems = items.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return {
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filteredItems,
  };
}
