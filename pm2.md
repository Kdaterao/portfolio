pm2 list --> lists all apps running 

pm2 delte <instance name> -> deletes specific instane 

PORT=<PORT> pm2 start <PATH_TO_FILE> --name "NAME" --> Starts up a non static app

pm2 start --name "<NAME>" pm2 serve <PATH_TO_DIST> <PORT_NUMBER> --> starts up a static app