let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/html");
editor.setOptions({
    fontSize: "14pt",
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

let tabs = [{
    id: 1,
    content: initialContent
}];

let currentTab = 1;

let preview             = document.getElementById('preview');
let runBtn              = document.getElementById('runBtn');
let addTabBtn           = document.getElementById('addTabBtn');
let startOverBtn        = document.getElementById('startOverBtn');
let startFromScratchBtn = document.getElementById('startFromScratchBtn');
let fullScreenBtn       = document.getElementById('fullScreenBtn');
let tabContainer        = document.getElementById('tabContainer');
let downloadBtn         = document.getElementById('downloadBtn');

runBtn.addEventListener                 ('click', runCode);
addTabBtn.addEventListener              ('click', addNewTab);
startOverBtn.addEventListener           ('click', startOver);
startFromScratchBtn.addEventListener    ('click', startFromScratch);
fullScreenBtn.addEventListener          ('click', toggleFullScreen);
tabContainer.addEventListener           ('click', handleTabClick);
downloadBtn.addEventListener            ('click', downloadCode);

function runCode() {
    let code = editor.getValue();
    preview.srcdoc = code;
}

function addNewTab() {
    let newTabId = tabs.length + 1;
    tabs.push({
        id: newTabId,
        content: `<!-- Tab ${newTabId} Content -->`
    });

    let newTab = document.createElement('button');
    newTab.className    = 'tab';
    newTab.innerHTML    = `Tab ${newTabId} <span class="tab-close">&times;</span>`;
    newTab.dataset.tab  = newTabId;

    tabContainer.insertBefore(newTab, addTabBtn);
    switchToTab(newTabId);
}

function handleTabClick(event) {
    if (event.target.classList.contains('tab')) {
        switchToTab(parseInt(event.target.dataset.tab));
    }
    
    else if (event.target.classList.contains('tab-close')) {
        closeTab(event.target.parentElement);
    }
}

function switchToTab(tabId) {
    tabs[currentTab - 1].content = editor.getValue();
    currentTab = tabId;

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.dataset.tab) === currentTab) {
            tab.classList.add('active');
        }
    });

    editor.setValue(tabs[currentTab - 1].content, -1);
    runCode();
}

function closeTab(tabElement) {
    let tabId = parseInt(tabElement.dataset.tab);
    if (tabs.length > 1) {
        tabs = tabs.filter(tab => tab.id !== tabId);
        tabElement.remove();

        if (currentTab === tabId) {
            switchToTab(tabs[0].id);
        }

        updateTabNumbers();
    }
}

function updateTabNumbers() {
    let tabElements = document.querySelectorAll('.tab');
    tabElements.forEach((tab, index) => {
        tab.textContent = `Tab ${index + 1}`;
        tab.dataset.tab = index + 1;
        tabs[index].id = index + 1;
    });
}

function startOver() {
    tabs = [{
        id: 1,
        content: initialContent
    }];
    currentTab = 1;

    tabContainer.innerHTML = '<button class="tab active" data-tab="1">Tab 1 <span class="tab-close">&times;</span></button>';
    tabContainer.appendChild(addTabBtn);

    editor.setValue(tabs[0].content, -1);
    runCode();
}

function startFromScratch() {
    tabs = [{
        id: 1,
        content: '<!-- Start your code here -->'
    }];
    currentTab = 1;

    tabContainer.innerHTML = '<button class="tab active" data-tab="1">Tab 1 <span class="tab-close">&times;</span></button>';
    tabContainer.appendChild(addTabBtn);

    editor.setValue(tabs[0].content, -1);
    runCode();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        preview.classList.add('fullscreen-preview');
        preview.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    }
    
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

let focusModeBtn = document.getElementById('focusModeBtn');
let body = document.body;

focusModeBtn.addEventListener('click', toggleFocusMode);

function toggleFocusMode() {
    body.classList.toggle('focus-mode');
    editor.resize();
}

let isFullFocus = false;

focusModeBtn.addEventListener('click', () => {
    isFullFocus = !isFullFocus;

    if (isFullFocus) {
        enterFullFocusMode();
        focusModeBtn.innerText = 'Exit Full Focus Mode';
    } else {
        exitFullFocusMode();
        focusModeBtn.innerText = 'Full Focus Mode';
    }
});

function enterFullFocusMode() {
    document.getElementById('header')   .style.display = 'none';
    document.getElementById('titles')   .style.display = 'none';  
    document.getElementById('controls') .style.display = 'block';
    document.getElementById('editor')   .style.height  = '100vh';
    document.getElementById('preview')  .style.height  = '100vh';
}

function exitFullFocusMode() {

    document.getElementById('header') .style.display = 'block'; 
    document.getElementById('titles') .style.display = 'block'; 
    document.getElementById('editor') .style.height  = ''; 
    document.getElementById('preview').style.height  = ''; 
}


function downloadCode() {
    let code  = editor.getValue();
    let blob  = new Blob([code], { type: 'text/html' });
    let link  = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'your_code.html';
    link.click();
    URL.revokeObjectURL(link.href);
}

function myFunction() {
    let element = document.body;
    element.classList.toggle("dark");
}

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
};

window.addEventListener('DOMContentLoaded', () => {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        preview.classList.remove('fullscreen-preview');
    }
});

const bgColorPicker = document.getElementById('bgColorPicker');
const resetColorBtn = document.getElementById('resetColorBtn');

window.addEventListener('DOMContentLoaded', () => {
    const savedColor = localStorage.getItem('backgroundColor');
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
        bgColorPicker.value = savedColor;
    }
});

bgColorPicker.addEventListener('input', (event) => {
    const color = event.target.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem('backgroundColor', color); 
});

// Reset button functionality
resetColorBtn.addEventListener('click', () => {
    document.body.style.backgroundColor = '';
    localStorage.removeItem('backgroundColor');
});


editor.setValue(tabs[0].content, -1);
runCode();
