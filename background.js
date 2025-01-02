let openTabs = {};

// Listen for when a tab is created
chrome.tabs.onCreated.addListener(function(tab) {
    console.log("Tab created: ", tab);
    // Now, let's listen for the tab to finish loading
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // We're checking if the tab has finished loading and has the correct URL
        if (tabId === tab.id && changeInfo.status === "complete" && tab.url && tab.url.includes("tankionline.com/play")) {
            // console.log("Tanki Online page opened and fully loaded!");
            openTabs[tab.id] = tab.url; // add to our list of open tabs
            fetch('http://localhost:3000/startRPC')
                .then(response => response.json())
                .then(data => {
                    console.log("Started RPC", data);
                })
                .catch(err => {
                    console.error("Error starting RPC", err);
                });
        }
    });
});

// Listen for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    console.log("Tab removed: ", tabId);
    
    // Check if the removed tab was a Tanki Online tab using the openTabs map
    if (openTabs[tabId] && openTabs[tabId].includes("tankionline.com/play")) {
        // console.log("Tanki Online tab closed, stopping RPC.");
        
        fetch('http://localhost:3000/stopRPC')
            .then(response => response.json())
            .then(data => {
                console.log("Stopped RPC", data);
            })
            .catch(err => {
                console.error("Error stopping RPC", err);
            });
        
        // Remove the tab from the openTabs tracker after it's closed
        delete openTabs[tabId];
    } else {
        // console.log("Tab removed but not a Tanki Online tab.");
    }
});
