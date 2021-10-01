const { app, dialog, BrowserWindow, Menu, MenuItem } = require('electron');
const Path = require('path');
const Open = require('open');

const { main } = require('./main');

// https://dev.to/aurelkurtula/creating-a-text-editor-in-electron-reading-files-13b8
function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});
	let menu;
	let currentFile;

	const openFile = () => {
		dialog.showOpenDialog({ properties: ['openFile'] })
			.then(result => {
				console.log(result.canceled);
				console.log(result.filePaths);
				if (result.filePaths.length > 0 && result.filePaths[0]) {
					currentFile = result.filePaths[0];
					mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURI(main(currentFile)));

					// TODO
					// menu.getMenuItemById('reload').disabled = false;
				}
			}).catch(error => {
				console.error(error);
			});
	};

	menu = Menu.buildFromTemplate([
		{
			label: 'File',
			submenu: [
				{
					id: 'ipen',
					label: 'Open worklog',
					accelerator: 'CommandOrControl+O',
					click: openFile
				}, {
					id: 'reload',
					label: 'Reload',
					disabled: true,
					accelerator: 'CommandOrControl+R',
					click() {
						if (currentFile) {
							mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURI(main(currentFile)));
						}
					}
				},
				{ role: 'quit' }
			]
		}, {
			label: 'Edit',
			submenu: [
				{
					id: 'openWorklogFile',
					label: 'Edit worklog',
					disabled: true,
					accelerator: 'CommandOrControl+E',
					click: () => {
						currentFile && Open(currentFile);
					}
				},
				{
					id: 'openWorklogDirectory',
					label: 'Open containing directory',
					disabled: true,
					accelerator: 'CommandOrControl+D',
					click: () => {
						currentFile && Open(Path.dirname(currentFile));
					}
				}
			]
		}
	]);
	Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});