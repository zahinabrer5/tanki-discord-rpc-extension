document.getElementById('saveKey').addEventListener('click', function () {
    const apiKey = document.getElementById('apiKeyInput').value;
    if (apiKey) {
        // Save the API key to chrome storage
        chrome.storage.local.set({ apiKey: apiKey }, function () {
            console.log('API key saved');
        });
    } else {
        alert('Please enter a valid API key');
    }
});
