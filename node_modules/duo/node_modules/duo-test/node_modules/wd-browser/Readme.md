
# wd-browser

  parse browser name and return wd browser names.

## Installation

    $ npm install wd-browser

## Examples

````js
parse('ie:6..11');          // => ie 6 to 11
parse('ie:*');              // => all ie versions (including unstable)
parse('ie:..7');            // => ie oldest to 7
parse('iphone:*');          // => all iphone versions
parse('android:*');         // => all android versions
parse('chrome:..stable')    // => all chrome versions including the latest stable
parse('chrome:stable')      // => latest stable chrome
parse('chrome:stable..')    // => from stable to latest beta.
```

## License

  MIT
