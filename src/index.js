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

	let currentFile;

	const menu = new Menu();
	menu.append(new MenuItem({
		id: 'ipen',
		label: 'Open',
		toolTip: 'Open worklog file',
		click() {
			dialog.showOpenDialog({ properties: ['openFile'] })
				.then(result => {
					console.log(result.canceled);
					console.log(result.filePaths);
					if (result.filePaths.length > 0 && result.filePaths[0]) {
						currentFile = result.filePaths[0];
						mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURI(main(currentFile)));

						// TODO
						menu.getMenuItemById('reload').disabled = false;
					}
				}).catch(error => {
					console.error(error);
				});
		}
	}));
	menu.append(new MenuItem({
		id: 'reload',
		label: 'Reload',
		disabled: true,
		toolTip: 'reload worklog file',
		click() {
			if (currentFile) {
				mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURI(main(currentFile)));
			}
		}
	}));
	menu.append(new MenuItem({
		id: 'edit',
		label: 'Edit worklog',
		disabled: true,
		toolTip: 'Edit worklog file in system editor',
		click() {
			if (currentFile) {
				Open(currentFile);
			}
		}
	}));
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