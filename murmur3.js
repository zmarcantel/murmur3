(function() {
  'use strict';

  var murmur3 = {
    version: "0.0.1"
  };


  //-----------------------------------------------------------------
  //
  // Binary Functions Missing in JavaScript
  //
  //-----------------------------------------------------------------

  murmur3.rotl = function(number, bits)
  {
    if (number[0] == 0 && number[1] == 0)
      return number;

    var high_shifted = (number[0] << bits) >>> 0,
        high_rotated = (number[0] >>> (32 - bits)) >>> 0;

    var low_shifted = (number[1] << bits) >>> 0,
        low_rotated = (number[1] >>> (32 - bits)) >>> 0;

    var high = (high_shifted | low_rotated) >>> 0,
        low = (low_shifted | high_rotated) >>> 0;

    return [high, low];
  }

  murmur3.shiftl = function(number, bits)
  {
    var data = number;

    if (number[0] == 0 && number[1] == 0)
      return number;

    if (bits == 64)
      return [0, 0];

    if (bits > 31) {
      data[0] = data[1];
      data[1] = 0;
      bits -= 32;
    }

    var high_shifted = (data[0] << bits) >>> 0,
        low_shifted = (data[1] << bits) >>> 0,
        low_carry = (data[1] >>> (32 - bits)) >>> 0;

    var high = (high_shifted | low_carry) >>> 0,
        low = low_shifted;

    return [high, low];
  }

  murmur3.shiftr = function(number, bits)
  {
    var data = number;

    if (number[0] == 0 && number[1] == 0)
      return number;

    if (bits == 64)
      return [0, 0];

    if (bits > 31) {
      data[1] = data[0] >>> 0;
      data[0] = 0;
      bits -= 32;
    }

    var high_shifted = (data[0] >>> bits) >>> 0,
        low_shifted = (data[1] >>> bits) >>> 0,
        high_carry = (data[0] << (32 - bits)) >>> 0;

    var high = high_shifted,
        low = (low_shifted | high_carry) >>> 0;

    return [high, low];
  }

  murmur3.xor64 = function(a, b)
  {
    return [(a[0] ^ b[0]) >>> 0, (a[1] ^ b[1]) >>> 0];
  }


  murmur3.add64 = function(a, b)
  {
    if (a[0] == 0 && a[1] == 0) return b;
    if (b[0] == 0 && b[1] == 0) return a;

    var low = (a[1] + b[1]);
    var carry = low > 0xFFFFFFFF ? (Math.floor(low / Math.pow(2,32)) >>> 0) : 0;
    var high = (a[0] + b[0] + carry);

    return [(high >>> 0), (low >>> 0)];
  }


  murmur3.mult64 = function(a, b)
  {
    a = [a[0] >>> 16, a[0] & 0xffff, a[1] >>> 16, a[1] & 0xffff];
    b = [b[0] >>> 16, b[0] & 0xffff, b[1] >>> 16, b[1] & 0xffff];
    var o = [0, 0, 0, 0];

    o[3] += a[3] * b[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;

    o[2] += a[2] * b[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;

    o[2] += a[3] * b[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;

    o[1] += a[1] * b[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;

    o[1] += a[2] * b[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;

    o[1] += a[3] * b[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;

    o[0] += (a[0] * b[3]) + (a[1] * b[2]) + (a[2] * b[1]) + (a[3] * b[0]);
    o[0] &= 0xffff;

    o[0] = o[0] >>> 0;
    o[1] = o[1] >>> 0;
    o[2] = o[2] >>> 0;
    o[3] = o[3] >>> 0;

    var result = [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    return result;
  }



  //-----------------------------------------------------------------
  //
  // Hashing Functions
  //
  //-----------------------------------------------------------------

  murmur3.fmix64 = function(number)
  {
    number = murmur3.xor64(number, [0, number[0] >>> 1]);
    number = murmur3.mult64(number, [0xff51afd7, 0xed558ccd]);
    number = murmur3.xor64(number, [0, number[0] >>> 1]);
    number = murmur3.mult64(number, [0xc4ceb9fe, 0x1a85ec53]);
    number = murmur3.xor64(number, [0, number[0] >>> 1]);

    return number;
  }


  murmur3.hash128 = function (key, seed)
  {
    key = key || '';
    seed = seed || 0;

    var remainder = key.length % 16;
    var blocks = Math.floor(key.length / 16);

    var h1 = [0, seed];
    var h2 = [0, seed];

    var k1 = [0, 0];
    var k2 = [0, 0];

    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];

    for (var i = 0; i < blocks; i += 16) {
      k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
      k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];

      k1 = murmur3.mult64(k1, c1);
      k1 = murmur3.rotl(k1, 31);
      k1 = murmur3.mult64(k1, c2);
      h1 = murmur3.xor64(h1, k1);

      h1 = murmur3.rotl(h1, 27);
      h1 = murmur3.add64(h1, h2);
      h1 = murmur3.add64(murmur3.mult64(h1, [0, 5]), [0, 0x52dce729]);

      k2 = murmur3.mult64(k2, c2);
      k2 = murmur3.rotl(k2, 33);
      k2 = murmur3.mult64(k2, c1);
      h2 = murmur3.xor64(h2, k2);

      h2 = murmur3.rotl(h2, 31);
      h2 = murmur3.add64(h2, h1);
      h2 = murmur3.add64(murmur3.mult64(h2, [0, 5]), [0, 0x38495ab5]);
    }

    k1 = [0, 0];
    k2 = [0, 0];

    switch(remainder) {
      case 15: k2 = murmur3.xor64(k2, murmur3.shiftl([0, key.charCodeAt(i + 14)], 48));
      case 14: k2 = murmur3.xor64(k2, murmur3.shiftl([0, key.charCodeAt(i + 13)], 40));
      case 13: k2 = murmur3.xor64(k2, murmur3.shiftl([0, key.charCodeAt(i + 12)], 32));
      case 12: k2 = murmur3.xor64(k2, murmur3.shiftl([0, key.charCodeAt(i + 11)], 24));
      case 11: k2 = murmur3.xor64(k2, murmur3.shiftl([0, key.charCodeAt(i + 10)], 16));
      case 10: k2 = murmur3.xor64(k2, murmur3.shiftl([0, key.charCodeAt(i + 9)], 8));
      case 9:  k2 = murmur3.xor64(k2, [0, key.charCodeAt(i + 8)]);
               k2 = murmur3.mult64(k2, c2);
               k2 = murmur3.rotl(k2, 33);
               k2 = murmur3.mult64(k2, c1);
               h2 = murmur3.xor64(h2, k2);
      
      case 8:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 7)], 56));
      case 7:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 6)], 48));
      case 6:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 5)], 40));
      case 5:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 4)], 32));
      case 4:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 3)], 24));
      case 3:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 2)], 16));
      case 2:  k1 = murmur3.xor64(k1, murmur3.shiftl([0, key.charCodeAt(i + 1)], 8));
      case 1:  k1 = murmur3.xor64(k1, [0, key.charCodeAt(i)]);
               k1 = murmur3.mult64(k1, c1);
               k1 = murmur3.rotl(k1, 31);
               k1 = murmur3.mult64(k1, c2);
               h1 = murmur3.xor64(h1, k1);
    }

    h1 = murmur3.xor64(h1, [0, key.length]);
    h2 = murmur3.xor64(h2, [0, key.length]);

    h1 = murmur3.add64(h1, h2);
    h2 = murmur3.add64(h2, h1);

    h1 = murmur3.fmix64(h1);
    h2 = murmur3.fmix64(h2);

    h1 = murmur3.add64(h1, h2);
    h2 = murmur3.add64(h2, h1);


    murmur3.hash_raw = [h1[1] >>> 0, h1[0] >>> 0, h2[1] >>> 0, h2[0] >>> 0];
    return murmur3;
  };

  murmur3.raw = function()
  {
    return murmur3.hash_raw;
  }

  murmur3.hex = function()
  {
    return murmur3.hash_raw[0].toString(16) + '' + 
           murmur3.hash_raw[1].toString(16) + '' + 
           murmur3.hash_raw[2].toString(16) + '' + 
           murmur3.hash_raw[3].toString(16);
  }

  module.exports = murmur3;

})();
