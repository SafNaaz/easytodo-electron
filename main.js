const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

//listen for the app to be ready
app.on("ready", () => {
  //create new window
  mainWindow = new BrowserWindow({});
  //load the html into window
  // file://dirname/mainWindow.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});

//create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
      },
      {
        label: "Clear Item",
      },
      {
        label: "Quit",
        click() {
          app.quit();
        },
      },
    ],
  },
];
