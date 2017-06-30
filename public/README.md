- To start a new discussion: -

1. Press the "add" button on the "Group" line. The Group initialization fields appear.

2. Enter the name of your new discussion after "Name."

3. Enter a number after "Total (min)", which will be the maximum time for discussion, in minutes. 

4. Enter a number after "Turn (sec)", which will be the minimum time a person can speak without any possibility of interruption, in seconds.

5. Press "Submit."

6. Enter your name after "Name" and then press "Join". 

7. The Discussion Page will appear. Press "My Turn" when you wish to speak. Hold the Button until you finish speaking. It is like a "Push-to-Talk" button, but one that is not active until you get a beep.


- If the Group already exists: -

1. Select the name of your discussion by pressing the downward pointing triangle after "Group". A list will appear. Select the Group name and press “Done".

2. Enter your name after "Name" and then Press "Join". 

3. The Discussion Page will appear. Press "My Turn" when you wish to speak. Hold the Button until you finish speaking. It is like a "Push-to-Talk" button, but one that is not active until you get a beep.

Complete documentation: 

http://doc.myturn.mobi

## For developers

Check for errors under `/var/log/node-myturn-api.log`, `/var/log/nginx/myturn-error.log`, and using right-click Inspect under Chromium, or similar JavaScript console functionality under other browsers.

To install this on a DigitalOcean droplet running Debian, do one of the 
following, depending on which version you want. The default version is "master",
generally the most stable:

- `sudo npm install --global --unsafe jcomeauictx/myturnb`
- `sudo npm install --global --unsafe jcomeauictx/myturnb#beta`
- `sudo npm install --global --unsafe jcomeauictx/myturnb#alpha`

There is also a `legacy` version, but that is only for developers who want to
see if a bug is new, or inherited from the previous developer's code.

When forking this project, or merging a pull request, make sure to change the
references to the repository owner (jcomeauictx in my case) to your own in this
`README.md` file and in `package.json`.
