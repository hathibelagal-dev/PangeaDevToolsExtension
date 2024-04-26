// Need to get the user's token and domain. Maybe they-re already in our storage?
const getUserTokenAndDomain = () => {
  chrome.storage.sync.get(["user_token", "user_domain"], function (items) {
    if (items["user_token"] && items["user_domain"]) {
      document.querySelector("#token_holder").value = items["user_token"];
      document.querySelector("#domain_holder").value = items["user_domain"];
      document.querySelector("#validation_status").innerHTML =
        "You are all set!";
      getURLData(items["user_token"], items["user_domain"]);
    } else {
      document.querySelector("#validation_status").innerHTML =
        "Please enter the token and domain you got from Pangea cloud in the fields above.";
    }
  });
};

// Store it locally
const setUserTokenAndDomain = (token, domain) => {
  chrome.storage.sync.set({
    user_token: token,
    user_domain: domain,
  });
  document.querySelector("#validation_status").innerHTML = "You are all set!";
};

// Get domain data
const getDomainData = async (token, domain, domainToCheck) => {
  const domainIntelURL1 = "https://domain-intel." + domain + "/v2/reputation";
  const domainIntelResponse1 = await makePostRequest(domainIntelURL1, token, {
    domains: [domainToCheck],
  });
  document.querySelector("#current_domain_rid").value =
    domainIntelResponse1["request_id"];
  document.querySelector("#current_domain_status").value =
    domainIntelResponse1["status"];
  console.log(domainIntelResponse1);
  console.log(domainToCheck);

  const domainIntelURL2 = "https://domain-intel." + domain + "/v1/whois";
  const domainIntelResponse2 = await makePostRequest(domainIntelURL2, token, {
    domain: domainToCheck,
  });
  try {
    const whoisData = domainIntelResponse2["result"]["data"];
    document.querySelector("#current_domain_registrar").value =
      whoisData["registrar_name"];
    document.querySelector("#current_domain_con").value =
      whoisData["created_date"];
    document.querySelector("#current_domain_country").value =
      whoisData["country"] || "Unknown";
    document.querySelector("#current_domain_ips").value =
      whoisData["ips"].join(", ");
    const baseDomain = whoisData["domain_name"];
    try {
      document.querySelector("#current_domain_score").value =
        domainIntelResponse1["result"]["data"][baseDomain]["score"];
    } catch (e) {}
    try {
      document.querySelector("#current_domain_verdict").value =
        domainIntelResponse1["result"]["data"][baseDomain]["verdict"];
    } catch (e) {}
  } catch (e) {}
};

// Get URL data
const getURLData = async (token, domain) => {
  const currentURL = await getURL();
  document.querySelector("#current_url").value = currentURL;
  const url = new URL(currentURL);
  document.querySelector("#current_domain").value = url.hostname;
  const urlIntelURL = "https://url-intel." + domain + "/v2/reputation";
  const urlIntelResponse = await makePostRequest(urlIntelURL, token, {
    urls: [currentURL],
  });
  console.log(urlIntelResponse);
  document.querySelector("#current_url_rid").value =
    urlIntelResponse["request_id"];
  document.querySelector("#current_url_status").value =
    urlIntelResponse["status"];
  if (urlIntelResponse["status"].toLowerCase() === "success") {
    try {
      document.querySelector("#current_url_verdict").value =
        urlIntelResponse["result"]["data"][currentURL]["verdict"];
    } catch (e) {}
    try {
      document.querySelector("#current_url_score").value =
        urlIntelResponse["result"]["data"][currentURL]["score"];
    } catch (e) {}
  } else {
    document.querySelector("#validation_status").innerHTML =
      "You provided an invalid token or domain, or something else has gone wrong! Please try again.";
  }
  getDomainData(token, domain, url.hostname);
};

const start = () => {
  document.querySelector("#update_button").addEventListener("click", (e) => {
    const token = document.querySelector("#token_holder").value;
    const domain = document.querySelector("#domain_holder").value;
    try {
      new URL("https://" + domain);
    } catch (e) {
      document.querySelector("#validation_status").innerHTML =
        "That's an invalid URL";
      return;
    }
    if (token && domain) {
      setUserTokenAndDomain(token, domain);
      getUserTokenAndDomain();
    }
  });
  getUserTokenAndDomain();
};

start();
