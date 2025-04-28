# group4-project-csci440-01w-SP2025
# Contributors: Jacob K., Alex T., Seungho L., Ahmya B., Makiyah S., Tristen S.

# How to start the application:
# 1. Open a terminal and enter 'cd back-end'
# 2. Enter 'npm run dev'
# 3. If no errors, open up a new terminal
# 4. Enter cd front-end
# 5. Enter 'npm run dev'
# 6. Copy the ouputed URL and paste it into your browser.


## To setup the frontend and backend, open the separate readme files in the front-end and back-end folders. Follow the instructions.

## Common backend errors:
## "Error: password authentication failed for user "postgres"": To prevent this error, find a file named pg_hba.conf. It will be in the data folder in the PostgreSQL program folder. C:\ProgramFiles\PostgreSQL\17\data. At the bottom of the file, there will a 'table' for allowing connections. Change all the values in the method column fromm 'scram-sha-256' or 'md5' to 'trust'. 
## "Error: listen EADDRINUSE: address already in use": To prevent this error, run "taskkill /f /im node.exe" in terminal. You should be able to run the backend now. 