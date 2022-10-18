export declare const identity: <T>(elem: T) => T;
export declare const toString: (elem: any) => string;
/**
 * given a sorted list, insert the given item in place after the last matching item.
 * @param elemToInsert the item to insert
 * @param list the list in which the element should be inserted
 * @param keyExtractor an optional element mapper, defaults to toString
 */
export declare function insertSortedLast<U>(elemToInsert: U, list: U[], keyExtractor?: (a: U) => any): void;
/**
 * Find the highest possible index where the given element should be inserted so that the order of the list is preserved.
 * @param needle the needle to find
 * @param haystack the pre sorted list
 * @param keyExtractor an optional needle mapper, defaults to toString
 */
export declare function findSortedInsertionIndexLast<U, V>(needle: U, haystack: V[], keyExtractor?: (a: V) => any): number;
/**
 * Find the index of an element in a sorted list. If list contains no matching element, return -1.
 */
export declare function findSortedIndex<U, V>(needle: U, haystack: V[], keyExtractor?: (a: V) => any): number;
/**
 * Like {@link Array.prototype.findIndex} but finds the last index instead.
 */
export declare function findLastIndex<T>(arr: T[], predicate: (x: T) => boolean): number;
/**
 * Like {@link Array.prototype.find} but finds the last matching element instead.
 */
export declare function findLast<T>(arr: T[], predicate: (x: T) => boolean): T | undefined;
/**
 * Return a new array, where all elements from the original array occur exactly once.
 */
export declare function removeDuplicates<T>(arr: T[], eq?: (x: T, y: T) => boolean): T[];
