export function query(Text) {
    switch(Text.modelSelection){
        case 1:
            return shuarya(Text)
        case 2:
            return ruben(Text)
        case 3:
            return shuarya(Text) // make GPT

    }

};



export function shuarya(Text) {
    return new Promise(async (resolve, reject) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", process.env.model_key);
            
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.model_bearer_token,
                },
                body: JSON.stringify({
                    "input": {
                        "prompt": "[INST] <<SYS>>You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information and tell the user to contact the teacher's assistant through the contact TA menu button. Explain your thought process step by step similar to a teacher or professor.<</SYS>>" + Text.body + "[/INST]",
                        "max_new_tokens": 500,
                        "temperature": 0.9,
                        "top_k": 50,
                        "top_p": 0.7,
                        "repetition_penalty": 1.2,
                        "batch_size": 8,
                        "stop": [
                            "</s>"
                        ]
                    }
                })
            };
            
            const response = await fetch('https://api.runpod.ai/v2/tsddif1jle8o98/runsync', requestOptions)
            const data = await response.json()
            
            resolve(data.output);
        } catch (error) {
            reject(error)
        }
    })
};

export function ruben(Text) {
    return new Promise(async (resolve, reject) => {
        try {

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: Text.body

                })
            };

            const response = await fetch(process.env.localHotSpot, requestOptions)
            const data = await response.text()

            resolve(data);
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