const getURL = async () => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    if(tabs) {
        return tabs[0].url;
    }
    return "No tab found";
}

const makePostRequest = async (url, token, json) => {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });
    const jsonResult = await response.json();
    return jsonResult;
}