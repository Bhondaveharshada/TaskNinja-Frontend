import React, { JSX } from "react";
import { IonSearchbar } from "@ionic/react";

interface FilterSearchBarProps<T> {
  data: T[];
  filterField: keyof T;
  onFiltered: (filtered: T[]) => void;
  debounce?: number;
}

const FilterSearchBar = <T,>({
  data,
  filterField,
  onFiltered,
  debounce = 300,
}: FilterSearchBarProps<T>): JSX.Element => {
  const handleSearch = (text: string) => {
    const filtered = data.filter((item) =>
      String(item[filterField]).toLowerCase().includes(text.toLowerCase())
    );
    onFiltered(filtered);
  };

  return (
    <IonSearchbar
      placeholder={`Search by ${String(filterField)}...`}
      debounce={debounce}
      onIonInput={(e) => handleSearch(e.detail.value!)}
    />
  );
};

export default FilterSearchBar;
