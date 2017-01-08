export function sortImmutableBy(key) {
  return (itemA, itemB) => {
    if (itemA.get(key) < itemB.get(key)) {
      return 1;
    }
    if (itemA.get(key) > itemB.get(key)) {
      return -1;
    }
    return 0;
  };
}
