let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/html");
editor.setOptions({
    fontSize: "10pt",
    showPrintMargin: false,
    highlightActiveLine: false
});

// ---------------------------------------------------------------------------
let initialContent =
`<!-- This is an example -->
<!-- You can freely modify this code -->
<!-- Or create your own -->
<!-- By pressing the "+" icon -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Cube</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #282c34;
        }

        .scene {
            width: 150px;
            height: 150px;
            perspective: 600px;
        }

        .cube {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transform: rotateX(30deg) rotateY(30deg);
            animation: rotate 10s infinite linear;
        }

        .cube div {
            position: absolute;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #000;
            box-sizing: border-box;
        }

        .front  { transform: translateZ(75px); }
        .back   { transform: rotateY(180deg) translateZ(75px); }
        .right  { transform: rotateY(90deg) translateZ(75px); }
        .left   { transform: rotateY(-90deg) translateZ(75px); }
        .top    { transform: rotateX(90deg) translateZ(75px); }
        .bottom { transform: rotateX(-90deg) translateZ(75px); }

        @keyframes rotate {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
        }
    </style>
</head>
<body>
    <div class="scene">
        <div class="cube">
            <div class="front"></div>
            <div class="back"></div>
            <div class="right"></div>
            <div class="left"></div>
            <div class="top"></div>
            <div class="bottom"></div>
        </div>
    </div>
</body>
</html>`;

// ---------------------------------------------------------------------------

let tabs = [{ id: 1, content: initialContent }];
let currentTab = 1;

const preview               = document.getElementById('preview');
const runBtn                = document.getElementById('runBtn');
const addTabBtn             = document.getElementById('addTabBtn');
const startOverBtn          = document.getElementById('startOverBtn');
const startFromScratchBtn   = document.getElementById('startFromScratchBtn');
const fullScreenBtn         = document.getElementById('fullScreenBtn');
const tabContainer          = document.getElementById('tabContainer');
const downloadBtn           = document.getElementById('downloadBtn');
const focusModeBtn          = document.getElementById('focusModeBtn');
const darkModeToggle        = document.getElementById('darkModeToggle');
const bgColorPicker         = document.getElementById('bgColorPicker');
const resetColorBtn         = document.getElementById('resetColorBtn');

// Function to run the code
function runCode() {
    preview.srcdoc = editor.getValue();
}

// Switch tab and save content of the previous tab
function switchToTab(tabId) {
    tabs[currentTab - 1].content = editor.getValue();
    currentTab = tabId;
    updateTabsUI();
    editor.setValue(tabs[currentTab - 1].content, -1);
    runCode();
}

// Update the tab UI to mark the active tab
function updateTabsUI() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.tab) === currentTab);
    });
}

// Add a new tab
function addNewTab() {
    const newTabId = tabs.length + 1;
    tabs.push({ id: newTabId, content: `<!-- Tab ${newTabId} Content -->` });
    const newTab = createTabElement(newTabId);
    tabContainer.insertBefore(newTab, addTabBtn);
    switchToTab(newTabId);
}

// Create a new tab element
function createTabElement(tabId) {
    const newTab = document.createElement('button');
    newTab.className = 'tab';
    newTab.dataset.tab = tabId;
    newTab.innerHTML = `Tab ${tabId} <span class="tab-close">&times;</span>`;
    return newTab;
}

// Handle tab click and close events
function handleTabClick(event) {
    const tabElement = event.target.closest('.tab');
    if (tabElement) {
        if (event.target.classList.contains('tab-close')) {
            closeTab(tabElement);
        } else {
            switchToTab(parseInt(tabElement.dataset.tab));
        }
    }
}

// Close a tab
function closeTab(tabElement) {
    const tabId = parseInt(tabElement.dataset.tab);

    // Ensure there's at least one tab left before closing
    if (tabs.length > 1) {
        // Remove the tab from the array
        tabs = tabs.filter(tab => tab.id !== tabId);

        // Remove the tab element from the DOM
        tabElement.remove();

        // Switch to the first tab after removing the current one
        if (currentTab === tabId) {
            switchToTab(tabs[0].id);
        }

        // Update the tab numbering after a tab is closed
        updateTabNumbers();
    }
}

// Update tab numbers after closing a tab
function updateTabNumbers() {
    const tabElements = document.querySelectorAll('.tab');
    tabElements.forEach((tab, index) => {
        tab.textContent = `Tab ${index + 1}`;
        tab.dataset.tab = index + 1;
        tabs[index].id = index + 1;

        // Re-add the close button to each tab after renumbering
        const closeButton = document.createElement('span');
        closeButton.classList.add('tab-close');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event bubbling
            closeTab(tab);
        });
        tab.appendChild(closeButton);
    });
}

// Reset the editor to its initial state
function startOver() {
    tabs = [{ id: 1, content: initialContent }];
    currentTab = 1;
    tabContainer.innerHTML = '<button class="tab active" data-tab="1">Tab 1 <span class="tab-close">&times;</span></button>';
    tabContainer.appendChild(addTabBtn);
    editor.setValue(tabs[0].content, -1);
    runCode();
}

function startFromScratch() {
    // Reset the tabs array with a new, blank tab
    tabs = [{
        id: 1,
        content: '<!-- Start your code here -->'
    }];

    // Reset the current tab to the first one
    currentTab = 1;

    // Update the tab container UI
    tabContainer.innerHTML = `
        <button class="tab active" data-tab="1">Tab 1 <span class="tab-close">&times;</span></button>
        <button id="addTabBtn">+</button>
    `;

    // Re-assign the event listener to the new Add Tab button
    const newAddTabBtn = document.getElementById('addTabBtn');
    newAddTabBtn.addEventListener('click', addNewTab);

    // Set the editor content to the new blank template
    editor.setValue(tabs[0].content, -1);

    // Run the code (which will clear the preview since it's empty)
    runCode();
}


// Toggle full screen for preview
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        preview.requestFullscreen().catch(err => console.error(`Error: ${err.message}`));
        preview.classList.add('fullscreen-preview');
    } else {
        document.exitFullscreen();
    }
}

// Focus mode toggle
function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    editor.resize();
}

// Full focus mode toggle logic
function toggleFullFocus() {
    const isFullFocus = document.body.classList.toggle('focus-mode');
    focusModeBtn.innerText = isFullFocus ? 'Exit Full Focus Mode' : 'Full Focus Mode';
}

// Download the code
function downloadCode() {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'your_code.html';
    link.click();
    URL.revokeObjectURL(link.href);
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}

// Background color functionality
function handleBackgroundColor() {
    const savedColor = localStorage.getItem('backgroundColor');
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
        bgColorPicker.value = savedColor;
    }
}

bgColorPicker.addEventListener('input', event => {
    const color = event.target.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem('backgroundColor', color);
});

resetColorBtn.addEventListener('click', () => {
    document.body.style.backgroundColor = '';
    localStorage.removeItem('backgroundColor');
});

// Event Listeners
runBtn.addEventListener             ('click', runCode);
addTabBtn.addEventListener          ('click', addNewTab);
startOverBtn.addEventListener       ('click', startOver);
startFromScratchBtn.addEventListener('click', startFromScratch);
fullScreenBtn.addEventListener      ('click', toggleFullScreen);
tabContainer.addEventListener       ('click', handleTabClick);
downloadBtn.addEventListener        ('click', downloadCode);
focusModeBtn.addEventListener       ('click', toggleFullFocus);
darkModeToggle.addEventListener     ('click', toggleDarkMode);

// Load saved settings
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    handleBackgroundColor();
    runCode();
});

// Handle full-screen changes
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        preview.classList.remove('fullscreen-preview');
    }
});

// Initialize the editor with the first tab content
editor.setValue(tabs[0].content, -1);
