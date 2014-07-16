var rGen = {};

/**
 * Top-level "main" of random object generator.
 *
 * @param {int} number of fields generated (parent) object will have
 * @param {int} random number generator seed
 * @return {Generator} random Object that grows on each .next()
 */
rGen.generate = function* (fieldCount, seed)
{
    var rng = new MersenneTwister(seed);

    for (let obj of rGen.generateObject(fieldCount, rng)) {
        yield obj;
    }
}

rGen.generateFieldName = function* (rng)
{
    for (let name of rGen.generateString(8, rng)) {
        yield name;
    }
}

rGen.generateField = function (length, rng)
{
    var generator = [
        function () {
            // integer generator
            return rGen.generateInt(0xfffff, rng);
        },

        function () {
            // double generator
            return (function* () {
                yield 0xfffff * (rng.random() - 1);
            })();
        },

        function () {
            // boolean generator
            return (function* () {
                yield rng.random() < 0.5 ? true : false;
            })();
        },

        function () {
            // string generator
            return rGen.generateString(length, rng);
        },

        function () {
            // null generator
            return (function* () {
                yield null;
            })();
        },

        function () {
            // undefined generator
            return (function* () {
                yield undefined;
            })();
        },

        function () {
            // Infinity generator
            return (function* () {
                yield 1/0;
            })();
        },

        function () {
            // NaN generator
            return (function* () {
                yield Math.sqrt(-1);
            })();
        },

        function () {
            // object generator
            return rGen.generateObject(length, rng);
        },

        function () {
            // array generator
            return rGen.generateArray(length, rng);
        }
    ];

    // return object field generator
    var i = rGen.randomInt(generator.length, rng);
    return generator[i]();
}

rGen.generateString = function* (length, rng)
{
    // allow only non-control utf8
    var illegalCodes = function (code) {
        if (code >= 0x0000 && code <= 0x001f) return true;
        if (code >= 0x0080 && code <= 0x009f) return true;
        return code === 0x007f;
    };

    var generatedString = '';
    yield generatedString;
    for(var i = 0; i < length; i++) {
        generatedString += String.fromCharCode(rGen.randomInt(0x00ff, rng, illegalCodes));
        yield generatedString;
    }
}

rGen.generateInt = function* (rightBound, rng, illegal)
{
    // nothing illegal by default
    var illegal = illegal || function () {return false;};

    var rand = function () {
        var candidate = Math.floor(rng.random() * rightBound);
        // recursively call until non-illegal candidate found
        return illegal(candidate) ? rand() : candidate;
    }

    yield rand();
}
rGen.randomInt = function (rightBound, rng, illegal)
{
    //TODO this should really be the basic element, with the
    //     generator wrapping the function...  jeez.
    return rGen.generateInt(rightBound, rng, illegal).next().value;
}

rGen.generateObject = function* (length, rng)
{
    var obj = {}
    yield obj;
    
    // length of nested objects, arrays, and strings decrease nonlinearly
    var nestedLength = Math.ceil(Math.sqrt(length));

    for (var i = 0; i < length; i++) {
        // generate property name by assigning and deleting each generation
        var finalName = '';
        for (let name of rGen.generateFieldName(rng)) {
            obj[name] = "...";
            yield obj;

            delete obj[name];
            finalName = name;
        }

        // use the generated field name and assign it a field value.
        for (let field of rGen.generateField(nestedLength, rng)) {
            obj[finalName] = field;
            yield obj;
        }
    }

}

rGen.generateArray = function* (length, rng)
{
    var arr = [];
    yield arr;

    // length of nested objects, arrays, and strings decrease nonlinearly
    var nestedLength = Math.ceil(Math.sqrt(length));

    for (var i = 0; i < length; i++) {
        // generate array value by pushing and popping each generation
        var finalVal;
        for (let val of rGen.generateField(nestedLength, rng)) {
            arr.push(val);
            yield arr;

            arr.pop();
            finalVal = val;
        }
        arr.push(finalVal);
    }
}

var gen = rGen.generate(100, 43);
var timer = setInterval(function () {
    var next = gen.next();
    if (next.done) {
        clearInterval(timer);
    } else {
        $('#object-text').text(JSON.stringify(next.value, null, '  '));
        $('#object-panel').scrollTop($('#object-panel').prop('scrollHeight'));
    }
}, 5)
