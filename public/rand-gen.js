var generateArray = function* (length, rng)
{
    var arr = [];
    yield arr;
    for (var i = 0; i < 5; i++) {
        arr.push(i);
        yield arr;
    }
}

var generateObject = function* (fieldCount, seed)
{
    var obj = {}
    yield obj;
    for (var i = 0; i < 7; i++) {
        for (let arr of generateArray()) {
            obj[i] = arr;
            yield obj;
        }
    }
}

for (let o of generateObject()) {
    console.log(JSON.stringify(o));
}
