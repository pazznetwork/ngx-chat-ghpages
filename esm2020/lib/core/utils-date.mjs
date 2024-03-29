/**
 * converts date objects to date strings like '2011-10-05'
 */
export function extractDateStringFromDate(date) {
    const isoString = date.toISOString();
    return isoString.slice(0, isoString.indexOf('T'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMtZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29yZS91dGlscy1kYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBQ0gsTUFBTSxVQUFVLHlCQUF5QixDQUFDLElBQVU7SUFDaEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JDLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGNvbnZlcnRzIGRhdGUgb2JqZWN0cyB0byBkYXRlIHN0cmluZ3MgbGlrZSAnMjAxMS0xMC0wNSdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3REYXRlU3RyaW5nRnJvbURhdGUoZGF0ZTogRGF0ZSk6IHN0cmluZyB7XG4gICAgY29uc3QgaXNvU3RyaW5nID0gZGF0ZS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiBpc29TdHJpbmcuc2xpY2UoMCwgaXNvU3RyaW5nLmluZGV4T2YoJ1QnKSk7XG59XG4iXX0=