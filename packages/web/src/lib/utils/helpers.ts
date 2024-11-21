type sortArg<T> = keyof T | `-${string & keyof T}`;

export function byPropertiesOf<T extends object>(sortBy: Array<sortArg<T>>) {
    function compareByProperty(arg: sortArg<T>) {
        let key: keyof T;
        let sortOrder = 1;
        if (typeof arg === 'string' && arg.startsWith('-')) {
            sortOrder = -1;
            // Typescript is not yet smart enough to infer that substring is keyof T
            key = arg.substr(1) as keyof T;
        } else {
            // Likewise it is not yet smart enough to infer that arg here is keyof T
            key = arg as keyof T;
        }
        return function (a: T, b: T) {
            const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;

            return result * sortOrder;
        };
    }

    return function (obj1: T, obj2: T) {
        let i = 0;
        let result = 0;
        const numberOfProperties = sortBy?.length;
        while (result === 0 && i < numberOfProperties) {
            result = compareByProperty(sortBy[i])(obj1, obj2);
            i++;
        }

        return result;
    };
}

export function sortBy<T extends object>(arr: T[], ...sortBy: Array<sortArg<T>>) {
    arr.sort(byPropertiesOf<T>(sortBy));
}

export function initializeFilterValues<T>(filters: FilterDescription<T>[], list: T[]) {
    for (const todo of list) {
        for (const filter of filters) {
            const values = todo[filter.property] as string | string[];
            if (values) {
                if (Array.isArray(values)) {
                    filter.values = [...filter.values, ...values];
                } else {
                    filter.values = [...filter.values, values];
                }
            }
        }
    }
}
