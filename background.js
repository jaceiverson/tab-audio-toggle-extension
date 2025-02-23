function toggleAudioTabs() {

    // Get all tabs with active audio
    chrome.tabs.query({ audible: true }, function (tabs) {
        // Create an array of tabs and their mute states
        var tabStates = tabs.map(function (tab, index) {
            return {
                tabId: tab.id,
                muted: tab.mutedInfo.muted,
                index: index
            };
        });
        console.log(tabStates);

        var currentIndex = tabStates.findIndex(function (tabState) {
            return !tabState.muted;
        });

        // If no tab is currently active and not muted, set currentIndex to 0 as fallback
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        console.log('currentIndex: ' + currentIndex)

        // Toggle the mute state of the tabs

        var currentTab = tabStates[currentIndex];
        var nextTab = tabStates[(currentIndex + 1) % tabStates.length];

        chrome.tabs.update(currentTab.tabId, { muted: true }, function (updatedTab) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            console.log('Tab ' + updatedTab.id + ' mute state toggled: ' + updatedTab.mutedInfo.muted);
        });

        chrome.tabs.update(nextTab.tabId, { muted: false, active: true }, function (updatedTab) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            console.log('Tab ' + updatedTab.id + ' mute state toggled: ' + updatedTab.mutedInfo.muted);
        });



        currentIndex = (currentIndex + 1) % tabStates.length; // Update the index for the next toggle
        console.log("currentIndex: " + currentIndex);
    });
}

// Function to execute the next function after the delay
function executeNextFunctionWithDelay(nextFunction) {
    // Delay in milliseconds
    let delayInMilliseconds = 1000; // 1 second
    setTimeout(nextFunction, delayInMilliseconds);
}

// Function to press the F key
function pressF() {
    chrome.automation.keyDown({ keyCode: 'KeyF' }, function () {
        chrome.automation.keyUp({ keyCode: 'KeyF' });
    });
}

// listener for when the extension icon is clicked
chrome.action.onClicked.addListener(function () {
    toggleAudioTabs();
});

// listener for when the keyboard shortcut is pressed
chrome.commands.onCommand.addListener(function (command) {
    if (command === 'toggle-audio-tabs') {
        toggleAudioTabs();
    }
    executeNextFunctionWithDelay(pressF);

});