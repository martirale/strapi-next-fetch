export function buildStrapiUrl(baseUrl, endpoint, params = {}) {
  const queryString = new URLSearchParams(flattenParams(params)).toString();
  return `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;
}

function flattenParams(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const prefixedKey = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenParams(value, prefixedKey));
    } else if (Array.isArray(value)) {
      value.forEach((val, i) => {
        acc[`${prefixedKey}[${i}]`] = val;
      });
    } else {
      acc[prefixedKey] = value;
    }

    return acc;
  }, {});
}
