import { byPropertiesOf } from './helpers';

export class TodoListHandler {
    public fullTodoList: SearchableTodo[] = [];

    constructor(initialList?: Todo[]) {
        if (initialList) {
            this.initList(initialList);
            this.sortList(true, 'assignee');
        }
    }

    initList(initialList: Todo[]) {
        this.fullTodoList = initialList.map((todo) => ({
            ...todo,
            searchTerms: `${todo.data} ${todo.assignee} ${todo.tags.join(' ')}`
        }));
    }

    add(todo: Todo) {
        const newSearchItem = {
            ...todo,
            searchTerms: `${todo.data} ${todo.assignee} ${todo.tags.join(' ')}`
        };
        this.fullTodoList.push(newSearchItem);
    }

    getSortedAndFilteredList(
        searchText: string,
        sortOrder: boolean,
        sortKey: string,
        filters: FilterDescription<Todo>[],
        removedList: string[]
    ): SearchableTodo[] {
        this.sortList(sortOrder, sortKey);
        return this.filterList(searchText, filters, removedList);
    }

    getFullList(): SearchableTodo[] {
        return this.fullTodoList;
    }

    sortList(sortOrder: boolean, sortKey: string): void {
        this.fullTodoList.sort(
            byPropertiesOf<SearchableTodo>([
                'done',
                ((sortOrder ? '' : '-') + sortKey) as sortArg<SearchableTodo>
            ])
        );
    }

    filterList(
        searchText: string,
        filters: FilterDescription<Todo>[],
        removedList: string[]
    ): SearchableTodo[] {
        const searchTerm = searchText.toLowerCase() || '';
        return this.fullTodoList.filter((item) => {
            const removed = removedList.includes(item.id);
            let filtered = true;
            for (const f of filters) {
                if (f.filterValues.length > 0) {
                    filtered =
                        typeof item[f.property] === 'string' &&
                        f.filterValues.includes(item[f.property] as string);
                }
            }
            return !removed && filtered && item.searchTerms.toLowerCase().includes(searchTerm);
        });
    }
}
