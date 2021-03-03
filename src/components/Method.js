
export const isEmptyValues = (value) => {
    let result = false;
    if (value === undefined) {
        return result
    }
    value.forEach(element => {
        if (element === '' || element === null || element === undefined) {
            result = true
        }
    });

    return result

}
export const isEmptyValue = (value) => {
    if (value === '' || value === null || value === undefined) {
        return true
    } else {
        return false
    }
}

