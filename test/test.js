var should = require('should'),
    murmur = require('../murmur3.js');

describe('Murmur3', function(){
  describe('Binary Functions', function() {
    describe('Rotate Left', function() {
      it ('0x8000000000000000 rotl 1 -> 1', function() {
        var result = murmur.rotl([0x80000000, 0], 1);
        result.should.eql([0, 1]);
      });

      it ('0xAABBCCDDEEFF0011 rotl 8 -> 0xBBCCDDEEFF0011AA', function() {
        var result = murmur.rotl([0xAABBCCDD, 0xEEFF0011], 8);
        result.should.eql([0xBBCCDDEE, 0xFF0011AA]);
      });
    })


    describe('Shift Left', function() {
      it ('0x8000000000000000 shiftl 1 -> 0', function() {
        var result = murmur.shiftl([0x80000000, 0], 1);
        result.should.eql([0, 0]);
      });

      it ('0xAABBCCDDEEFF0011 shiftl 8 -> 0xBBCCDDEEFF001100', function() {
        var result = murmur.shiftl([0xAABBCCDD, 0xEEFF0011], 8);
        result.should.eql([0xBBCCDDEE, 0xFF001100]);
      });

      it ('0xAA shiftl 8 -> 0xAA00', function() {
        var result = murmur.shiftl([0, 0xAA], 8);
        result.should.eql([0, 0xAA00]);
      });

      it ('0xAA shiftl 16 -> 0xAA0000', function() {
        var result = murmur.shiftl([0, 0xAA], 16);
        result.should.eql([0, 0xAA0000]);
      });

      it ('0xAA shiftl 32 -> 0xAA00000000', function() {
        var result = murmur.shiftl([0, 0xAA], 32);
        result.should.eql([0xAA, 0]);
      });

      it ('0xAA shiftl 64 -> 0', function() {
        var result = murmur.shiftl([0, 0xAA], 64);
        result.should.eql([0, 0]);
      });
    })

    describe('Shift Right', function() {
      it ('0x01 shiftr 1 -> 0', function() {
        var result = murmur.shiftr([0, 1], 1);
        result.should.eql([0, 0]);
      });

      it ('0xAABBCCDDEEFF0011 shiftr 8 -> 0x00AABBCCDDEEFF00', function() {
        var result = murmur.shiftr([0xAABBCCDD, 0xEEFF0011], 8);
        result.should.eql([0x00AABBCC, 0xDDEEFF00]);
      });

      it ('0xAABBCCDDEEFF0011 shiftr 16 -> 0x0000AABBCCDDEEFF', function() {
        var result = murmur.shiftr([0xAABBCCDD, 0xEEFF0011], 16);
        result.should.eql([0x0000AABB, 0xCCDDEEFF]);
      });

      it ('0xAABBCCDDEEFF0011 shiftr 32 -> 0x00000000AABBCCDD', function() {
        var result = murmur.shiftr([0xAABBCCDD, 0xEEFF0011], 32);
        result.should.eql([0x00000000, 0xAABBCCDD]);
      });

      it ('0xAABBCCDDEEFF0011 shiftr 48 -> 0x000000000000AABB', function() {
        var result = murmur.shiftr([0xAABBCCDD, 0xEEFF0011], 48);
        result.should.eql([0x00000000, 0x0000AABB]);
      });

      it ('0xAABBCCDDEEFF0011 shiftr 64 -> 0x0000000000000000', function() {
        var result = murmur.shiftr([0xAABBCCDD, 0xEEFF0011], 64);
        result.should.eql([0x00000000, 0x00000000]);
      });
    })


    describe('Add 64', function() {
      it ('Simple', function() {
        var result = murmur.add64([0xAABBCCDD, 0], [0, 0xEEFF0011]);
        result.should.eql([0xAABBCCDD, 0xEEFF0011]);
      });

      it ('Overflow on low: 1', function() {
        var result = murmur.add64([0, 0xFFFFFFFF], [0, 1]);
        result.should.eql([1, 0]);
      });

      it ('Overflow on low: 0xFF', function() {
        var result = murmur.add64([0, 0xFFFFFFFF], [0, 0xFF]);
        result.should.eql([1, 0xFE]);
      });

      it ('Overflow on low: 0x100', function() {
        var result = murmur.add64([0, 0xFFFFFF00], [0, 0x1FF]);
        result.should.eql([1, 0xff]);
      });
    })

    describe('Multiply 64', function() {
      it ('Simple', function() {
        var result = murmur.mult64([0, 0xFFFFFFFF], [0, 2]);
        result.should.eql([1, 0xFFFFFFFE >> 0]);
      });


      it ('0xFFFFFFFF * 0xFFFFFFFF', function() {
        var result = murmur.mult64([0, 0xFFFFFFFF], [0, 0xFFFFFFFF]);
        result.should.eql([0xfffffffe >> 0, 0x00000001]);
      });

      it ('0xAABBCCDD * 0xEEFF0011 :: negative signed', function() {
        var result = murmur.mult64([0, 0xAABBCCDD], [0, 0xEEFF0011]);
        result.should.eql([0x9f64a991 >> 0, 0xdc9b9aad >> 0]);
      });

      it ('0xAABBCCDD * 0x0011EEFF :: negative/positive', function() {
        var result = murmur.mult64([0, 0xAABBCCDD], [0, 0x0011EEFF]);
        result.should.eql([0xbf5dd, 0x44338623]);
      });

      it ('0x0011EEFF * 0xAABBCCDD :: commutative of above', function() {
        var result = murmur.mult64([0, 0xAABBCCDD], [0, 0x0011EEFF]);
        result.should.eql([0xbf5dd, 0x44338623]);
      });
    })



    describe('Murmur Mix', function() {
      it ('0xAABBCCDDEEFF0011', function() {
        var result = murmur.fmix64([0xAABBCCDD, 0xEEFF0011]);
        result.should.eql([0xda96f3cc >>> 0, 0x12ba301a]);

        result = murmur.fmix64(result);
        result.should.eql([0xb62c7b6f >>> 0, 0x3df5dd54]);
      });

      it ('0x1122334455667788', function() {
        var result = murmur.fmix64([0x11223344, 0x55667788]);
        result.should.eql([0x561e55b6, 0xed000437 >>> 0]);

        result = murmur.fmix64(result);
        result.should.eql([0x23b73e57, 0x16c14968]);
      });
    });


    describe('Hex String', function() {
      it ('"Zach" -> Hash -> Hex', function() {
        var hash = murmur.hash128("Zach");
        murmur.hex(hash).should.equal('79ee4b4693b0ae57717c87ca4260b281');
      })

      it ('"Marcantel" -> Hash -> Hex', function() {
        var hash = murmur.hash128("Marcantel");
        murmur.hex(hash).should.equal('6c0e9b3113a5c0f91e75d4db2472c108');
      })

      it ('"Thank God, this was a pain to write" -> Hash -> Hex', function() {
        var hash = murmur.hash128("Thank God, this was a pain to write");
        murmur.hex(hash).should.equal('247cf51b13a5cb2ba62266a699b0663d');
      })
    })
  })
})