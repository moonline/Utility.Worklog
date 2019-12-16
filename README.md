# Utility.Worklog

> Track your working hours, spent on projects, only with a text editor.

You can track your working hours and public holidays in csv files and calculate your working hour balance with this tool. This allows you to easily version your worklog by git or edit syncronized worklog files on your phone by a simple text editor.

To generate the worklog summary nodejs is required.


## Installation

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
3. [Download & unzip latest release](https://github.com/moonline/Utility.Worklog/releases) or [Clone source](https://github.com/moonline/Utility.Worklog/archive/master.zip)
4. Install dependencies 
   ```sh
   cd release-x.y
   yarn install
   ```
5. Copy `worklog.desktop` to `~/.local/share/applications/worklog.desktop` and change the path for the worklog utility and the worklog csv file in the following line:
```bash
Exec=gnome-terminal -x bash -c "node ~/Utility.Worklog/main.js ~/Documents/2019-worklog.csv; bash"
```

## Usage

### Example setup

~/Documents/Admin/2019-worklog.csv:
```csv
Day,Start,End,Project,Task
01/01/19,09:00,12:00,Worklog utility,Basic worklog functionality
01/01/19,13:00,18:00,Worklog utility,Calendar support
```

~/Documents/Admin/2019-worklog.calendar.csv:
```csv
# Type: Public holiday | Sick day | Holiday | Unpayed holiday
Day,Quantity,Type
02/01/19,1,Public holiday
```

~/Documents/Admin/2019-worklog.config.json:
```json
{
    "workingHoursPerDay": 8,
    "startDay": "01/01/19"
}
```

### Run
```sh
node /path/to/main.js Documents/Admin/2019-worklog.csv
```

