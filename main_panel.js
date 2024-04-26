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
  document.querySelector("#current_domain_result").value =
    domainIntelResponse1["summary"];

  const domainIntelURL2 = "https://domain-intel." + domain + "/v1/whois";
  const domainIntelResponse2 = await makePostRequest(domainIntelURL2, token, {
    domain: domainToCheck,
  });
  try {
    const whoisData = domainIntelResponse2["result"]["data"];
    document.querySelector("#current_domain_registrar").value =
      whoisData["registrar_name"];
    document.querySelector("#current_domain_country").value =
      whoisData["country"] || "Unknown";
    document.querySelector("#current_domain_ips").value =
      whoisData["ips"].join(", ");
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
  document.querySelector("#current_url_rid").value =
    urlIntelResponse["request_id"];
  document.querySelector("#current_url_status").value =
    urlIntelResponse["status"];
  if (urlIntelResponse["status"].toLowerCase() === "success") {
    try {
      document.querySelector("#current_url_result").value =
        urlIntelResponse["summary"];
    } catch (e) {}
  }
  getDomainData(token, domain, url.hostname);
};

const start = () => {
  document.querySelector("#update_button").addEventListener("click", (e) => {
    const token = document.querySelector("#token_holder").value;
    const domain = document.querySelector("#domain_holder").value;
    if (token && domain) {
      setUserTokenAndDomain(token, domain);
    }
  });
  getUserTokenAndDomain();
};

start();
