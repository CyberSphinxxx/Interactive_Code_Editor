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
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="style.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap");

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
        }

        body{
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: url('anime_background.png') no-repeat; //added a picture
            background-size: cover;
            background-position: center;

        }   

        .wrapper {
            width: 450px;
            background-color: transparent;
            border: 2px solid rgba(255, 255, 255, .2);
            backdrop-filter: blur(20px);
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
            color: rgb(255, 255, 255);
            border-radius: 30px ;
            padding: 30px 40px;
        }

        .wrapper h1{

            font-size: 36px;
            text-align: center;
        }

        .wrapper .input-box{
            position: relative;
            width: 100%;
            height: 50px;
            margin: 30px 0;
        }

        .input-box input{
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            border: 2px solid rgba(255, 255, 255, .2);
            border-radius: 40px;
            font-size: 16px;
            color: #fff;
            padding: 25px 45px 25px 20px;
        }

        .input-box input::placeholder{
            color: #fff;
        }

        .input-box i{
            position: absolute;
            right: 20px;
            top: 20px;
            transition: translateY(-50%);
            font-size: 20px;
        }

        .wrapper .remember-forgot{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin: -15px 0 15px;
        }
        .remember-forgot label input{
        accent-color: white;
        margin-right: 3px;
        }

        .remember-forgot a:hover {
            text-decoration: underline;
        }

        .wrapper button{
            width: 100%;
            height: 40px;
            background: rgb(32, 214, 208);
            border: none;
            outline: none;
            border-radius: 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .1);
            cursor: pointer;
            font-size: 16px;
            color: #333;
            font-weight: 700;
        }

        .wrapper .register-link{
            font-size: 14px;
            text-align: center;
            margin-top: 20px 0 15px;
        }

        .register-link p a {
            color:#fff;
            text-decoration: none;
            font-weight: 600;
        }

        .register-link p a:hover{
            text-decoration: underline;
        }
    </style>

</head>
<body>
    
    <div class="wrapper">
        <form action="">
            <h1>Login</h1>
            <div class ="input-box">
                <input type="text" placeholder="Username" required>
                <i class='bx bxs-user'></i>
            </div>

            <div class = "input-box">
                <input type="password"
                placeholder="Password" required>
                <i class='bx bxs-lock-alt' ></i>
            </div>

            <div class="remember-forgot">
                <label><input type="checkbox"> Remember me</label>
                <a href="#">Forgot Password?</a> <!-- put your other html file in the href-->
            </div>
        
            <button type="submit" class="button">Login</button>

            <div class="">
                <p>Don't have an account??
                    <a href="#">Create Account</a></p> <!-- put your other html file in the href-->
            </div>

            </form>
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

runBtn.addEventListener             ('click', runCode);
addTabBtn.addEventListener          ('click', addNewTab);
startOverBtn.addEventListener       ('click', startOver);
startFromScratchBtn.addEventListener('click', startFromScratch);
fullScreenBtn.addEventListener      ('click', toggleFullScreen);
tabContainer.addEventListener       ('click', handleTabClick);

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

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        preview.classList.remove('fullscreen-preview');
    }
});

// Initialize
editor.setValue(tabs[0].content, -1);
runCode();
