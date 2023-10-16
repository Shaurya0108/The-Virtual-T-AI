export async function query(Text) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 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");
    
    var raw = JSON.stringify({
        "inputs": "nooo yes no"
    });
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: Text,
        redirect: 'follow'
    };
    

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1",requestOptions)
    .then(response => response.text())
    .then( result => result)
    .catch(error => console.log('error', error))
    return await response;
};
