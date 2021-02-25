export const isEmptyValues = (value) => {
    let result = false;
    value.forEach(element => {
        if (element === '' || element === null || element === undefined) {
            result = true
        }
    });

    return result

}

