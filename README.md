Murmur3
===============

A NodeJS module for sub-millisecond, non-cryptographic hashes using the Murmur3 algorithm.

Note: As of v0.0.1, only the 128 bit hash is supported.


Bonus
===============

Javascript does not contain 64 bit operations....

Instead, the standard complies to a 64 bit floating point representation that gives 58 bits of precision in integers.

To overcome this, I had to fill in these gaps. As such, I have allowed these operations to be accessed from the `murmur` object.

The functions include:
  * `add64(a, b)` :: Addition
  * `mult64(a, b)` :: Multiplication
  * `shiftr(a, bits)` :: Shift right
  * `shiftl(a, bits)` :: Shift left
  * `rotl(a, bits)` :: Rotate left
  * `where (a) or (b) are a 64 bit integer of format [nHigh, nLow]`

Hash Usage
===============

  * `.hash128(string)` :: Hash the given string. Returns the `murmur` object.
  * `.raw()` :: Return the array of four "32 bit unsigned integers"
  * `.hex()` :: Return a 16 character/byte, string, hex representation

Alternatively, the raw array may be accessed with `murmur.hash_raw`.

    var murmur = require('murmur3');

    // NOTE: currently only 128 bit length is implemented

    // array of 4 "32 bit unsigned integers"
    var hash = murmur.hash128('string of text or data').raw();

    // or with a seed (limited to 32 bit address space)
    var seeded = murmur.hash128('string of text or data', 0xFFFFFFFF);

    // returns 16 character hex representation as a string
    var string_hex = murmur.hash128('will be 16byte hex').hex();


Testing
===============

Install `mocha` and `should` using

    npm install --dev

Note: `npm 1.2.18` contains a bug that tries to install the development version of all devDependencies. Omit the `--dev` option and it should work correctly.

Once everything is installed:

    make test
