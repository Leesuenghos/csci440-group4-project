## install nmap https://nmap.org/download.html
## install postgre https://www.postgresql.org/download
## install metasploit https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html
## setup postgre database

## connect to postgres database
```
psql 
```

## create a new user with password
```
alter user postgres with password 'NewStrongPass123';
```

## create a new database
```
create database threatdb;
```

## connect to the new database
```  
\c threatdb
```

## create tables for threat detection and DDoS simulation
``` 
create table if not exists threat_events (
  id serial primary key,
  type varchar(50) not null,
  source_ip varchar(50),
  dest_ip varchar(50),
  severity varchar(20),
  event_time timestamp default now()
);

create table if not exists ddos_simulations (
  id serial primary key,
  target_ip varchar(50) not null,
  port integer not null,
  method varchar(20) not null,
  threads integer not null,
  duration integer not null, -- in seconds
  start_time timestamp default now(),
  end_time timestamp
);
```

## You also must run 'npm install' in the terminal inside the back-end folder to download all the dependencies. 


## SNORT INSTALLATION
## 1. Install Snort (Snort_2_9_20_Installer.x64.exe under Binaries): https://www.snort.org/downloads
## 2. Install npcap: https://npcap.com/#download
## 3. Scroll down to Rules and download "community-rules.tar.gz" under Snort v2.9
## 4. Check where Snort was installed (should be C:/Snort)
## 5. Copy the file "community.rules" from step 2 and paste it in the rules directory in the Snort folder
## 6. Go to the folder "etc" and change the name snort.conf to snort_backup.conf (backing up config file in case you make mistake)
## 7. Take the file in this backend folder named snort.conf and paste it to the etc folder (correct configurations will already be implemented) 
  ## NOTE: If you have download Snort to a different location besides C:\Snort, you will have to make more manual changes to the config file yourself. Snort needs the absolute path to certain Snort files. 
## 8. Open snort.conf with notepad and head to line 45. You need replace 'any' with the ip address range of your network (ipconfig /all will help you. I also left an example ip address range for you).
## Resources references: 
  ## https://letsdefend.io/blog/how-to-install-and-configure-snort-on-windows
  ## https://www.youtube.com/watch?v=naLbhKW62nY&ab_channel=JustEd

## Common backend errors:
## "Error: password authentication failed for user "postgres"": To prevent this error, find a file named pg_hba.conf. It will be in the data folder in the PostgreSQL program folder. C:\ProgramFiles\PostgreSQL\17\data. At the bottom of the file, there will a 'table' for allowing connections. Change all the values in the method column fromm 'scram-sha-256' or 'md5' to 'trust'. 
## "Error: listen EADDRINUSE: address already in use": To prevent this error, run "taskkill /f /im node.exe" in terminal. You should be able to run the backend now. 