import { byPropertiesOf, getUsernameById } from "./helpers";

export class ListHandler<T> {
  public fullList: SearchableItem<T>[] = [];
  searchableProperties: (keyof T)[] = [];
  houseMembers: User[] = [];
  baseSortKey: keyof T

  constructor(
    baseSortKey: keyof T,
    properties: (keyof T)[] = [],
    houseMembers: User[] = [],
    initialList?: T[]
  ) {
    this.baseSortKey = baseSortKey;
    if (initialList) {
      this.initList(properties, houseMembers, initialList);
      this.sortList(true, "assignee");
    }
  }

  initList(properties: (keyof T)[], houseMembers: User[], initialList: T[]) {
    this.searchableProperties = properties;
    this.houseMembers = houseMembers;
    this.fullList = initialList.map((item) => ({
      ...item,
      searchTerms: this.constructSearchString(item)
    }));
  }

  constructSearchString(item: T): string {
    let searchString = "";
    for (const property of this.searchableProperties) {
      let key = property as keyof T;
      let value: string = item[key] as string;
      if (key === "assignee") {
        value = getUsernameById(value as string, this.houseMembers) as string;
      }
      searchString += `${value} `;
    }
    return searchString;
  }

  add(item: T) {
    const newSearchItem = {
      ...item,
      searchTerms: this.constructSearchString(item)
    };
    this.fullList.push(newSearchItem);
  }

  getSortedAndFilteredList(
    searchText: string,
    sortOrder: boolean,
    sortKey: string,
    filters: FilterDescription<T>[],
    removedList: string[],
  ): SearchableItem<T>[] {
    this.sortList(sortOrder, sortKey);
    return this.filterList(searchText, filters, removedList);
  }

  getFullList(): SearchableItem<T>[] {
    return this.fullList;
  }

  sortList(sortOrder: boolean, sortKey: string): void {
    this.fullList.sort(
      byPropertiesOf<SearchableItem<T>>([
        this.baseSortKey as sortArg<SearchableItem<T>>,
        ((sortOrder ? "" : "-") + sortKey) as sortArg<SearchableItem<T>>
      ])
    );
  }

  filterList(
    searchText: string,
    filters: FilterDescription<T>[],
    removedList: string[]
  ): SearchableItem<T>[] {
    const searchTerm = searchText.toLowerCase() || "";
    return this.fullList.filter((item) => {
      const removed = removedList.includes(item.id);
      let filtered = true;
      for (const f of filters) {
        if (f.filterValues.length > 0) {
          filtered =
            typeof item[f.property] === "string" &&
            f.filterValues.includes(item[f.property] as string);
        }
      }
      return (
        !removed &&
        filtered &&
        item.searchTerms.toLowerCase().includes(searchTerm)
      );
    });
  }
}
