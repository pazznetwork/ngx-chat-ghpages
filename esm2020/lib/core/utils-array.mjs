export const identity = elem => elem;
export const toString = elem => elem.toString();
/**
 * given a sorted list, insert the given item in place after the last matching item.
 * @param elemToInsert the item to insert
 * @param list the list in which the element should be inserted
 * @param keyExtractor an optional element mapper, defaults to toString
 */
export function insertSortedLast(elemToInsert, list, keyExtractor = toString) {
    list.splice(findSortedInsertionIndexLast(keyExtractor(elemToInsert), list, keyExtractor), 0, elemToInsert);
}
/**
 * Find the highest possible index where the given element should be inserted so that the order of the list is preserved.
 * @param needle the needle to find
 * @param haystack the pre sorted list
 * @param keyExtractor an optional needle mapper, defaults to toString
 */
export function findSortedInsertionIndexLast(needle, haystack, keyExtractor = toString) {
    let low = 0;
    let high = haystack.length;
    while (low !== high) {
        const cur = Math.floor(low + (high - low) / 2);
        if (needle < keyExtractor(haystack[cur])) {
            high = cur;
        }
        else {
            low = cur + 1;
        }
    }
    return low;
}
/**
 * Find the index of an element in a sorted list. If list contains no matching element, return -1.
 */
export function findSortedIndex(needle, haystack, keyExtractor = toString) {
    let low = 0;
    let high = haystack.length;
    while (low !== high) {
        const cur = Math.floor(low + (high - low) / 2);
        const extractedKey = keyExtractor(haystack[cur]);
        if (needle < extractedKey) {
            high = cur;
        }
        else if (needle > extractedKey) {
            low = cur + 1;
        }
        else {
            return cur;
        }
    }
    return -1;
}
/**
 * Like {@link Array.prototype.findIndex} but finds the last index instead.
 */
export function findLastIndex(arr, predicate) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}
/**
 * Like {@link Array.prototype.find} but finds the last matching element instead.
 */
export function findLast(arr, predicate) {
    return arr[findLastIndex(arr, predicate)];
}
/**
 * Return a new array, where all elements from the original array occur exactly once.
 */
export function removeDuplicates(arr, eq = (x, y) => x === y) {
    const results = [];
    for (const arrElement of arr) {
        let duplicateFound = false;
        for (const resultElement of results) {
            if (eq(arrElement, resultElement)) {
                duplicateFound = true;
                break;
            }
        }
        if (!duplicateFound) {
            results.push(arrElement);
        }
    }
    return results;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMtYXJyYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2NvcmUvdXRpbHMtYXJyYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFzQixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztBQUN4RCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQTBCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBRXZFOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUFJLFlBQWUsRUFBRSxJQUFTLEVBQUUsZUFBOEIsUUFBUTtJQUNsRyxJQUFJLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQy9HLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSw0QkFBNEIsQ0FBTyxNQUFTLEVBQUUsUUFBYSxFQUFFLGVBQThCLFFBQVE7SUFDL0csSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1osSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUUzQixPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFFakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFL0MsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3RDLElBQUksR0FBRyxHQUFHLENBQUM7U0FDZDthQUFNO1lBQ0gsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDakI7S0FFSjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBTyxNQUFTLEVBQUUsUUFBYSxFQUFFLGVBQThCLFFBQVE7SUFDbEcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1osSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUUzQixPQUFPLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFFakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFL0MsTUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksTUFBTSxHQUFHLFlBQVksRUFBRTtZQUN2QixJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ2Q7YUFBTSxJQUFJLE1BQU0sR0FBRyxZQUFZLEVBQUU7WUFDOUIsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDakI7YUFBTTtZQUNILE9BQU8sR0FBRyxDQUFDO1NBQ2Q7S0FFSjtJQUVELE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUFJLEdBQVEsRUFBRSxTQUE0QjtJQUNuRSxLQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxDQUFDLENBQUM7U0FDWjtLQUNKO0lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNkLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUksR0FBUSxFQUFFLFNBQTRCO0lBQzlELE9BQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUksR0FBUSxFQUFFLEtBQThCLENBQUMsQ0FBSSxFQUFFLENBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDL0YsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLEtBQUssTUFBTSxVQUFVLElBQUksR0FBRyxFQUFFO1FBQzFCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztRQUMzQixLQUFLLE1BQU0sYUFBYSxJQUFJLE9BQU8sRUFBRTtZQUNqQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUU7Z0JBQy9CLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLE1BQU07YUFDVDtTQUNKO1FBQ0QsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzVCO0tBQ0o7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGlkZW50aXR5OiA8VD4oZWxlbTogVCkgPT4gVCA9IGVsZW0gPT4gZWxlbTtcbmV4cG9ydCBjb25zdCB0b1N0cmluZzogKGVsZW06IGFueSkgPT4gc3RyaW5nID0gZWxlbSA9PiBlbGVtLnRvU3RyaW5nKCk7XG5cbi8qKlxuICogZ2l2ZW4gYSBzb3J0ZWQgbGlzdCwgaW5zZXJ0IHRoZSBnaXZlbiBpdGVtIGluIHBsYWNlIGFmdGVyIHRoZSBsYXN0IG1hdGNoaW5nIGl0ZW0uXG4gKiBAcGFyYW0gZWxlbVRvSW5zZXJ0IHRoZSBpdGVtIHRvIGluc2VydFxuICogQHBhcmFtIGxpc3QgdGhlIGxpc3QgaW4gd2hpY2ggdGhlIGVsZW1lbnQgc2hvdWxkIGJlIGluc2VydGVkXG4gKiBAcGFyYW0ga2V5RXh0cmFjdG9yIGFuIG9wdGlvbmFsIGVsZW1lbnQgbWFwcGVyLCBkZWZhdWx0cyB0byB0b1N0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0U29ydGVkTGFzdDxVPihlbGVtVG9JbnNlcnQ6IFUsIGxpc3Q6IFVbXSwga2V5RXh0cmFjdG9yOiAoYTogVSkgPT4gYW55ID0gdG9TdHJpbmcpOiB2b2lkIHtcbiAgICBsaXN0LnNwbGljZShmaW5kU29ydGVkSW5zZXJ0aW9uSW5kZXhMYXN0KGtleUV4dHJhY3RvcihlbGVtVG9JbnNlcnQpLCBsaXN0LCBrZXlFeHRyYWN0b3IpLCAwLCBlbGVtVG9JbnNlcnQpO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGhpZ2hlc3QgcG9zc2libGUgaW5kZXggd2hlcmUgdGhlIGdpdmVuIGVsZW1lbnQgc2hvdWxkIGJlIGluc2VydGVkIHNvIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBsaXN0IGlzIHByZXNlcnZlZC5cbiAqIEBwYXJhbSBuZWVkbGUgdGhlIG5lZWRsZSB0byBmaW5kXG4gKiBAcGFyYW0gaGF5c3RhY2sgdGhlIHByZSBzb3J0ZWQgbGlzdFxuICogQHBhcmFtIGtleUV4dHJhY3RvciBhbiBvcHRpb25hbCBuZWVkbGUgbWFwcGVyLCBkZWZhdWx0cyB0byB0b1N0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFNvcnRlZEluc2VydGlvbkluZGV4TGFzdDxVLCBWPihuZWVkbGU6IFUsIGhheXN0YWNrOiBWW10sIGtleUV4dHJhY3RvcjogKGE6IFYpID0+IGFueSA9IHRvU3RyaW5nKTogbnVtYmVyIHtcbiAgICBsZXQgbG93ID0gMDtcbiAgICBsZXQgaGlnaCA9IGhheXN0YWNrLmxlbmd0aDtcblxuICAgIHdoaWxlIChsb3cgIT09IGhpZ2gpIHtcblxuICAgICAgICBjb25zdCBjdXIgPSBNYXRoLmZsb29yKGxvdyArIChoaWdoIC0gbG93KSAvIDIpO1xuXG4gICAgICAgIGlmIChuZWVkbGUgPCBrZXlFeHRyYWN0b3IoaGF5c3RhY2tbY3VyXSkpIHtcbiAgICAgICAgICAgIGhpZ2ggPSBjdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb3cgPSBjdXIgKyAxO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gbG93O1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGluZGV4IG9mIGFuIGVsZW1lbnQgaW4gYSBzb3J0ZWQgbGlzdC4gSWYgbGlzdCBjb250YWlucyBubyBtYXRjaGluZyBlbGVtZW50LCByZXR1cm4gLTEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kU29ydGVkSW5kZXg8VSwgVj4obmVlZGxlOiBVLCBoYXlzdGFjazogVltdLCBrZXlFeHRyYWN0b3I6IChhOiBWKSA9PiBhbnkgPSB0b1N0cmluZyk6IG51bWJlciB7XG4gICAgbGV0IGxvdyA9IDA7XG4gICAgbGV0IGhpZ2ggPSBoYXlzdGFjay5sZW5ndGg7XG5cbiAgICB3aGlsZSAobG93ICE9PSBoaWdoKSB7XG5cbiAgICAgICAgY29uc3QgY3VyID0gTWF0aC5mbG9vcihsb3cgKyAoaGlnaCAtIGxvdykgLyAyKTtcblxuICAgICAgICBjb25zdCBleHRyYWN0ZWRLZXkgPSBrZXlFeHRyYWN0b3IoaGF5c3RhY2tbY3VyXSk7XG4gICAgICAgIGlmIChuZWVkbGUgPCBleHRyYWN0ZWRLZXkpIHtcbiAgICAgICAgICAgIGhpZ2ggPSBjdXI7XG4gICAgICAgIH0gZWxzZSBpZiAobmVlZGxlID4gZXh0cmFjdGVkS2V5KSB7XG4gICAgICAgICAgICBsb3cgPSBjdXIgKyAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGN1cjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIExpa2Uge0BsaW5rIEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXh9IGJ1dCBmaW5kcyB0aGUgbGFzdCBpbmRleCBpbnN0ZWFkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExhc3RJbmRleDxUPihhcnI6IFRbXSwgcHJlZGljYXRlOiAoeDogVCkgPT4gYm9vbGVhbik6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaSA9IGFyci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycltpXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBMaWtlIHtAbGluayBBcnJheS5wcm90b3R5cGUuZmluZH0gYnV0IGZpbmRzIHRoZSBsYXN0IG1hdGNoaW5nIGVsZW1lbnQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMYXN0PFQ+KGFycjogVFtdLCBwcmVkaWNhdGU6ICh4OiBUKSA9PiBib29sZWFuKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGFycltmaW5kTGFzdEluZGV4KGFyciwgcHJlZGljYXRlKV07XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbmV3IGFycmF5LCB3aGVyZSBhbGwgZWxlbWVudHMgZnJvbSB0aGUgb3JpZ2luYWwgYXJyYXkgb2NjdXIgZXhhY3RseSBvbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlczxUPihhcnI6IFRbXSwgZXE6ICh4OiBULCB5OiBUKSA9PiBib29sZWFuID0gKHg6IFQsIHk6IFQpID0+IHggPT09IHkpOiBUW10ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyckVsZW1lbnQgb2YgYXJyKSB7XG4gICAgICAgIGxldCBkdXBsaWNhdGVGb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdEVsZW1lbnQgb2YgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVxKGFyckVsZW1lbnQsIHJlc3VsdEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgZHVwbGljYXRlRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZHVwbGljYXRlRm91bmQpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChhcnJFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cbiJdfQ==