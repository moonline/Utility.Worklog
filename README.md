# Utility.Worklog

> Track your working hours, spent on projects, only with a text editor.

You can track your working hours and public holidays in csv files and calculate your working hour balance with this tool. This allows you to easily version your worklog by git or edit syncronized worklog files on your phone by a simple text editor.

![](documentation/worklog-screenshot.png)

Simply create a configuration file, a calendar file and the worklog file and open the worklog file:

![](documentation/worklog-init-screenshot.png)


## Installation

### Linux (Appimage/Snap)

Download installation package of the [latest release](https://github.com/moonline/Utility.Worklog/releases).

#### Create AppImage launcher

Copy AppImage file to `.local/bin/` in your home directory and copy the launcher `worklog-utility.desktop` to `.local/share/applications/`:

```sh
mv ~/Downloads/worklog-utility-1.0.1.AppImage ~/.local/bin/worklog-utility.AppImage
mv ~/Downloads/worklog-utility.desktop ~/.local/share/applications/worklog-utility.desktop
```

### Windows / Mac

Build and pack executable from source by electron-builder using `yarn dist`.


## Usage

### Example setup

`~/Documents/Admin/2021-worklog.csv`:

```csv
Day,Start,End,Project,Task
01/01/21,09:00,12:00,Worklog utility,Basic worklog functionality
01/01/21,13:00,18:00,Worklog utility,Calendar support
```

`~/Documents/Admin/2021-worklog.calendar.csv`:

```csv
# Type: Public holiday | Sick day | Holiday | Unpaid holiday | Unpaid leave
Day,Quantity,Type
02/01/21,1,Public holiday
```

`~/Documents/Admin/2021-worklog.config.json`:

```json
{
    "workingHoursPerDay": 8,
    "startDay": "01/01/21",
    "endDay": "31/01/21"
}
```


## Development

### Installation

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
3. [Clone source](https://github.com/moonline/Utility.Worklog/archive/master.zip)
4. Install dependencies 

```sh
cd release-x.y
yarn install
```

5. Start

```sh
yarn start
```

### Create installation package

```sh
yarn dist
```

You will find the corresponding packages in `dist`.
