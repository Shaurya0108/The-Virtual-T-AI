export function query(Text) {
    return new Promise(async (resolve, reject) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", process.env.model_key);
            
            var queryBody = JSON.stringify({
                "inputs": Text.body
            });
            
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: queryBody,
                redirect: 'follow'
            };
            
            const response = await fetch(process.env.model_route, requestOptions)
            .then(response => response.json())
            resolve(response[0]);
        } catch (error) {
            reject(error)
        }
    })
};

// here we can define a function to see if the model is down and return a loading status to front end
// extra if we have tme
export async function getModelStatus(Text) {
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

//Add option for chatGPT
// can append promts infront to specify user request outside of fine tuning
export async function queryGPT(Text) {
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

//Add option for handling syllabus specific/multiple models
export async function querySyllabus(Text) {
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

export async function queryMultiModel(Text) {
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