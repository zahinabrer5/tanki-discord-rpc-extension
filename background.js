// Function to get API key and make the request
function startRPC() {
    // Retrieve the API key from storage
    chrome.storage.local.get('apiKey', function (data) {
        const apiKey = data.apiKey;

        if (!apiKey) {
            console.error('API Key not found');
            return;
        }

        fetch('http://localhost:3000/startRPC', {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(data => {
                console.log('RPC started:', data);
            })
            .catch(error => {
                console.error('Error starting RPC:', error);
            });
    });
}

// Function to get API key and make the request
function stopRPC() {
    // Retrieve the API key from storage
    chrome.storage.local.get('apiKey', function (data) {
        const apiKey = data.apiKey;

        if (!apiKey) {
            console.error('API Key not found');
            return;
        }

        fetch('http://localhost:3000/stopRPC', {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(data => {
                console.log('RPC stopped:', data);
            })
            .catch(error => {
                console.error('Error stopping RPC:', error);
            });
    });
}

let openTabs = {};

// Listen for when a tab is created
chrome.tabs.onCreated.addListener(function (tab) {
    // console.log("Tab created: ", tab);
    // Now, let's listen for the tab to finish loading
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        // We're checking if the tab has finished loading and has the correct URL
        if (tabId === tab.id && changeInfo.status === "complete" && tab.url && tab.url.includes("tankionline.com/play")) {
            // console.log("Tanki Online page opened and fully loaded!");
            openTabs[tab.id] = tab.url; // add to our list of open tabs
            startRPC();
        }
    });
});

// Listen for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    // console.log("Tab removed: ", tabId);
    // Check if the removed tab was a Tanki Online tab using the openTabs map
    if (openTabs[tabId] && openTabs[tabId].includes("tankionline.com/play")) {
        // console.log("Tanki Online tab closed, stopping RPC.");
        stopRPC();
        // Remove the tab from the openTabs tracker after it's closed
        delete openTabs[tabId];
    } else {
        // console.log("Tab removed but not a Tanki Online tab.");
    }
});
