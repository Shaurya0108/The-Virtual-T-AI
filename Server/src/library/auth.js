

export const auth = ({authorization}, resolve, reject) => {
    if (authorization){
        var authorized = true
        resolve(authorized)
    }
    else {
        throw new Error('no authorization');
    }

}