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
    
    var obj = {}
    yield obj;
    for (var i = 0; i < fieldCount; i++) {
        // generate property name by assigning and deleting each
        // generation to the object
        var fieldName = '';
        for (let name of rGen.generateFieldName(rng)) {
            obj[fieldName] = undefined;
            yield obj;

            delete obj[fieldName];
            fieldName = name;
        }

        // use the generated field name and assign it a field value
        for (let field of rGen.generateField(fieldCount, rng)) {
            obj[fieldName] = field;
            yield obj;
        }
    }
}

rGen.generateFieldName = function* (rng)
{
    //TODO
    yield "butt";
}

rGen.generateField = function* (length, rng)
{
    //TODO
    yield 133780085;
}

rGen.generateInt = function* (rightBound, rng, illegal)
{
    //TODO
    yield 42;
}

rGen.generateString = function* (length, rng)
{
    //TODO
    yield "not a string";
}

rGen.generateObject = function* (length, rng)
{
    //TODO
    yield {ass: "hole"};
}

rGen.generateArray = function* (length, rng)
{
    //TODO
    var arr = [];
    yield arr;
    for (var i = 0; i < 5; i++) {
        arr.push(i);
        yield arr;
    }
}

var gen = rGen.generate(10, 42);
var timer = setInterval(function () {
    var next = gen.next();
    if (next.done) clearInterval(timer);
    else console.log(JSON.stringify(next.value));
}, 500)
