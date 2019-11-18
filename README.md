# Utility.Worklog

## Installation

1. Install Node
2. Install yarn
3. Clone source
4. Install dependencies `yarn install`

## Usage

### Setup

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

