
// used at Student Table, so that user can do case insisitive filter
export function caseInsensitiveFilter(filter, row) {
  // convert the filter to lowercase
  let nameFilter = filter.value.toLowerCase();

  // convert the original name to lowercase
  let originalName = row[filter.id];
  originalName = originalName.toLowerCase();

  // test
  return originalName.includes(nameFilter);
}

export function calcPageSize() {
  let browserHeight = document.documentElement.clientHeight;
  let pageSize = (browserHeight - 228) / 38;
  return Math.floor(pageSize);
}

