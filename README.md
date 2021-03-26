The objective is to test whether the Openfin's Java Script App is able to connect to the Openfin channel which is created from the Java Adapter code. I have tried the below steps and found it not working in terms of channel connection.

1) Run the node server in localhost using the code given under https://github.com/hiteshdholaria/openfin-helloworld-app
2) Create Openfin app launcher using https://github.com/hiteshdholaria/openfin-helloworld-app/blob/main/src/app_local.json config file and install the same in localhost
3) Open the above created app from Start Menu in Windows localhost
4) Inspect the above launched app using Developer Tools
5) Run the Java Adapter class (e.g., TestOpenFinApp) given under https://github.com/hiteshdholaria/openfin-helloworld-app/blob/main/src/TestOpenFinApp.java
6) See if the Java Script app is able to connect to the "openfin-test-channel" channel
