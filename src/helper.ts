
/** Split input string on first occurence of `split` */
export function splitOn(input: string, split: string) {
  const n = input.indexOf(":");
  return [input.substring(0, n), input.substring(n + 1)];
}

export function splitTagArray(state: any, selectedTags: string[]): string[][] {
  const tagArray = state.tags;
  const result: any = [];
  tagArray.forEach((tag: string) => {
    // eg. tag = "a:road"
    const [k, v]: string[] = splitOn(tag, ":");
    const i: number = parseInt(k, 16);
    result.push([selectedTags[i], v]);
  });
  return result;
}

/** Get a tags as a dict: {amenity: "bench", man_made: "yes" } */
export function getTagDict(state: any, selectedTags: string[]): { [_: string]: string } {
  const result: { [_: string]: string } = {};
  splitTagArray(state, selectedTags).forEach(([k, v]: string[]) => {
    result[k] = v;
  });
  return result;
}

export function formatPercent(x: any): string {
  return x === undefined ? "-" : `${x.toFixed(1)}%`;
}

export function stateIsVisible(state: any): boolean {
  return (state.state === "VIS");
}

export function stateIsDeleted(state: any): boolean {
  return (state.state === "DEL");
}

export function stateIsNotCreated(state: any): boolean {
  return (state.state === "NC");
}
