export async function query(Text) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", process.env.model_key);
    
    var queryBody = JSON.stringify({
        "inputs": Text.body.substring(1, Text.body.length-1)
    });
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: queryBody,
        redirect: 'follow'
    };
    

    const response = await fetch(process.env.model_route,requestOptions)
    .then(response => response.text())
    .then( result => result)
    .catch(error => console.log('error', error))
    return response;
};
