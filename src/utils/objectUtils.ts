export const objectUtils = {
  deepCopy: (object: any) => {
    return JSON.parse(JSON.stringify(object))
  }
}
