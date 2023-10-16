export async function query(Text) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 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");
    
    var queryBody = JSON.stringify({
        "inputs": Text.body.substring(1, Text.body.length-1)
    });
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: queryBody,
        redirect: 'follow'
    };
    

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1",requestOptions)
    .then(response => response.text())
    .then( result => result)
    .catch(error => console.log('error', error))
    return response;
};
