const { app, dialog, screen, BrowserWindow, Menu, MenuItem } = require('electron');
const Path = require('path');
const Open = require('open');

const { ReportController } = require('./controller/report-controller');


class App {
	constructor() {
		app.whenReady().then(() => {
			this.createWindow();
			this.createMenu();

			// mac
			app.on('activate', function () {
				if (BrowserWindow.getAllWindows().length === 0) {
					this.createWindow();
					this.createMenu();
				}
			});
		});

		app.on('window-all-closed', function () {
			// !mac
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});
	}

	createWindow = () => {
		const dimensions = screen.getPrimaryDisplay().workAreaSize;
		this.mainWindow = new BrowserWindow({
			width: dimensions.width,
			height: dimensions.height,
			icon: Path.join(__dirname, 'resources/icon.png')
		});
		this.currentFile;
		this.controller = new ReportController();
		this.mainWindow.loadURL(
			'data:text/html;charset=utf-8,' + encodeURI(this.controller.indexAction())
		);
	}

	createMenu = () => {
		this.menu = Menu.buildFromTemplate([
			{
				label: 'File',
				submenu: [
					{
						id: 'ipen',
						label: 'Open worklog',
						accelerator: 'CommandOrControl+O',
						click: this.openFile
					}, {
						id: 'reload',
						label: 'Reload',
						enabled: false,
						accelerator: 'CommandOrControl+R',
						click: () => {
							if (this.currentFile) {
								this.mainWindow.loadURL(
									'data:text/html;charset=utf-8,' + encodeURI(this.controller.listAction(this.currentFile))
								);
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
						enabled: false,
						accelerator: 'CommandOrControl+E',
						click: () => {
							this.currentFile && Open(this.currentFile);
						}
					},
					{
						id: 'openWorklogDirectory',
						label: 'Open containing directory',
						enabled: false,
						accelerator: 'CommandOrControl+D',
						click: () => {
							this.currentFile && Open(Path.dirname(this.currentFile));
						}
					}
				]
			}
		]);
		Menu.setApplicationMenu(this.menu);
	}

	setMenuItemStatus = () => {
		const status = Boolean(this.currentFile);
		this.menu.getMenuItemById('reload').enabled = status;
		this.menu.getMenuItemById('openWorklogFile').enabled = status;
		this.menu.getMenuItemById('openWorklogDirectory').enabled = status;
	}

	openFile = () => {
		dialog.showOpenDialog({ properties: ['openFile'] })
			.then(result => {
				if (result.filePaths.length > 0 && result.filePaths[0]) {
					this.currentFile = result.filePaths[0];
					this.mainWindow.loadURL(
						'data:text/html;charset=utf-8,' + encodeURI(this.controller.listAction(this.currentFile))
					);

					this.setMenuItemStatus();
				}
			}).catch(error => {
				console.error(error);
			});
	};
}

new App();
