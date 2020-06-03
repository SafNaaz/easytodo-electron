const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

process.env.NODE_ENV = "production";

let mainWindow;
let addWindow;

//listen for the app to be ready
app.on("ready", () => {
  //create new window
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //load the html into window
  // file://dirname/mainWindow.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //quit app when closed
  mainWindow.on("closed", () => {
    app.quit();
  });

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});

//handle create add window
createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add ToDo Item",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //load the html into window
  // file://dirname/mainWindow.html
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //garbage collection handle
  addWindow.on("close", () => {
    addWindow = null;
  });

  addWindow.setMenu(null);
};

// catch item:Add
ipcMain.on("item:add", (e, item) => {
  //console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

//create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        accelerator: process.platform == "darwin" ? "Command+N" : "Ctrl +N",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Item",
        click() {
          mainWindow.webContents.send("item:clear");
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl +Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

//if mac, add empty object to menu

if (process.platform == "darwin") {
  mainMenuTemplate.unshift({}); //add in array
}

// add developer tools item if not in prod
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl +I",
        click() {
          app.quit();
        },
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
