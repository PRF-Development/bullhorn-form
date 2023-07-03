// fetch calls
var response;
var text;
// connexion
const client_id = "1dc57863-b501-4039-8d54-08bb08ba1086";
const client_secret = "9KA6of7MVhDvWwNue7IUof1J";
const password = "Cappuccino12345";
const username = "Cappuccinoconsulting.api";
// api
var code;
var tokens;
var BhRestToken;
var restUrl;
var rest;
var access_token;
var refresh_token;
// file input
var input = document.querySelector("input[type=file]");

async function get_code(client_id, password, username) {
    var myHeaders = new Headers();
    var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
    };
    const url_part1 =
        "https://auth.bullhornstaffing.com/oauth/authorize?client_id=";
    const url_part2 = "&response_type=code&username=";
    const url_part3 = "&password=";
    const url_part4 = "&action=Login";
    const full_url =
        url_part1 +
        client_id +
        url_part2 +
        username +
        url_part3 +
        password +
        url_part4;
    // console.log("url: " + full_url);
    response = await fetch(full_url, requestOptions);
    const a = response.url.search("code=");
    const b = response.url.substring(a + 5).search("&");
    const code = response.url.substring(a + 5, a + 5 + b);
    return code;
}
async function get_tokens(code, client_id, client_secret) {
    var requestOptions = {
        method: "POST",
        redirect: "manual",
    };
    const url_part1 =
        "https://auth.bullhornstaffing.com/oauth/token?grant_type=authorization_code&code=";
    const url_part2 = "&client_id=";
    const url_part3 = "&client_secret=";
    const full_url =
        url_part1 + code + url_part2 + client_id + url_part3 + client_secret;
    // console.log("url: " + full_url);
    response = await fetch(full_url, requestOptions);
    text = await response.text();
    return JSON.parse(text);
}
async function get_rest(access_token) {
    var requestOptions = {
        method: "POST",
        redirect: "manual",
    };
    const url_part =
        "https://rest.bullhornstaffing.com/rest-services/login?version=*&access_token=";
    const full_url = url_part + access_token;
    // console.log("url: " + full_url);
    response = await fetch(full_url, requestOptions);
    text = await response.text();
    return JSON.parse(text);
}
async function full_api_connect(client_id, client_secret, password, username) {
    code = await get_code(client_id, password, username);
    // console.log("code: " + code);
    tokens = await get_tokens(code, client_id, client_secret);
    access_token = tokens["access_token"];
    refresh_token = tokens["refresh_token"];
    // console.log("access_token: " + access_token);
    // console.log("refresh_token: " + refresh_token);
    rest = await get_rest(access_token);
    BhRestToken = rest["BhRestToken"];
    restUrl = rest["restUrl"];
    // console.log("BhRestToken: " + BhRestToken);
    // console.log("restUrl: " + restUrl);
}

async function get_candidate(candidate_nb, fields) {
    // connect
    await full_api_connect(client_id, client_secret, password, username);
    // get data
    var requestOptions = {
        method: "GET",
        redirect: "manual",
    };
    const url_part1 = "entity/Candidate/";
    const url_part2 = "?BhRestToken=";
    const url_part3 = "&fields=";
    const full_url =
        restUrl +
        url_part1 +
        candidate_nb +
        url_part2 +
        BhRestToken +
        url_part3 +
        fields;
    // console.log("url: " + full_url);
    response = await fetch(full_url, requestOptions);
    text = await response.text();
    return JSON.parse(text).data;
}

function fileToBase64(file) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}
async function put_cv(candidateId){
    var file = input.files[0];
    var result = fileToBase64(file);
    var pdf = await result.then(function (val) {return val});
    pdf = pdf.substring(28);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    d = {
        externalID: "portfolio",
        fileContent: pdf,
        fileType: "SAMPLE",
        name: "CV.pdf",
        contentType: "pdf",
        description: "Resume file for candidate.",
        type: "cover",
        fileSize: pdf.length.toString(),
    };
    var raw = JSON.stringify(d);
    console.log(JSON.parse(raw));
    url_part = "file/Candidate/";
    full_url = restUrl + url_part + candidateId;
    var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "manual",
    };
    file_response = await fetch(full_url, requestOptions);
    text_file_response = await file_response.text();
    parsed_file_response = JSON.parse(text_file_response);
    return parsed_file_response
}

async function put_candidate(candidate) {
    // connect
    await full_api_connect(client_id, client_secret, password, username);
    // put data
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(candidate);
    var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "manual",
    };
    const url_part = "entity/Candidate?BhRestToken=";
    const full_url = restUrl + url_part + BhRestToken;

    response = await fetch(full_url, requestOptions);
    text_response = await response.text();
    parsed_response = JSON.parse(text_response);
    candidateId = parsed_response.changedEntityId
    // parsed_file_response = await put_cv(candidateId);
    // parsed_response["fileUpload"] = parsed_file_response;
    // return parsed_response;
}

// // get data
// const fields = "firstName,lastName,address,comments";
// const candidate_nb = 5337;
// var data = get_candidate(candidate_nb, fields).then((d) => console.log(d));

// // put data
// const candidate = {
//   firstName: "test3",
//   lastName: "last3",
//   name: "testing3",
//   username: "testing3!",
//   address: {
//     address1: "2 rue des champs",
//     address2: "de blé",
//     city: "paris",
//     state: "fr",
//     zip: "75000",
//     countryID: "1",
//   },
// };
// var out = put_candidate(candidate).then((d) => console.log(d));