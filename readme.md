Online BMSTU Cheat Extension
-

Highlights answers for [BMSTU online test system](https://online.bmstu.ru).

Installation
-

```bash
git clone https://github.com/kupihleba/bmstu-online-cheater; 
cd bmstu-online-cheater;
mkdir lib; 
cd lib; 
wget https://code.jquery.com/jquery-3.4.1.min.js
```
Open your chrome browser `More tools` -> `Extensions`

Switch to `Developer mode`
 
Press `Load unpacked extension` and specify path to the bmstu-online-cheater folder.

Reload the page on the test. Correct answers would be highlighted on hover.

Issues
-
* The BMSTU test server does not check whether the question that client answers was recently given;

* Registration of users do not require captcha or proper email validation;

API
-
We recovered POST queries for **registration**, **course enrollment**, **answering** and **answer checking**.

BACKEND
-
There is a Python bjoern WSGI server serving content behind nginx balancer.
The reduction of amount of queries is achieved through using local storage on the client side and SQLite DB on the 
server side.

>Server is offline by default