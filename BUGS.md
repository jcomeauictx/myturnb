## Chrome on Debian, single user test

- doesn't countdown at all when I don't press the button

- only counts down by speaker time if I do press the button, i.e., if time to speak was set to 3, it counts down 3 second intervals.

- always ends with a number between 0 and "speak time" remaining, with "Current speaker" set to my name, if I let it count down to "zero" with button pressed. remains ticking.

## General problems

- hardcoded URL somewhere in API: found these in console:
  * http://myturn.mobi/api/socket.io/1/xhr-polling/y400U3jSklBogC6-Q-A-?t=1491532949013 Failed to load resource: the server responded with a status of 502 (Bad Gateway)
  * http://myturn.mobi/api/socket.io/1/xhr-polling/y400U3jSklBogC6-Q-A-?t=1491532949013 Failed to load resource: the server responded with a status of 502 (Bad Gateway)
  * app.html:1 XMLHttpRequest cannot load http://myturn.mobi/api/socket.io/1/xhr-polling/y400U3jSklBogC6-Q-A-?t=1491532949013. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://local.myturn.old' is therefore not allowed access. The response had HTTP status code 502.
