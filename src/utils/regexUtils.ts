export const regexUtils = {
    containsOnlyNumbers: (str: string) => {
        return /^\d+$/.test(str);
    }
}
