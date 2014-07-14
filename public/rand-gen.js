var genStrings = function* (num)
{
    var ret = '';
    for (var i = 0; i < num; i++) {
        ret += i;
        yield ret;
    }
}

/**
 *  Generates the nth fibonacci number array tree.
 *
 *  EX: n = 0
 *      
 *      0
 *
 *  EX: n = 1
 *      
 *      1
 *
 *  EX: n = 2
 *      
 *      [0, 1]
 *
 *  EX: n = 3
 *      
 *      [1, [0, 1]]
 *
 *  EX: n = 4
 *      
 *      [[0, 1], [1, [0, 1]]
 *
 *  EX: stepwise n = 5
 *      
 *      [3, 4]
 *      [[1, 2], 4]
 *      [[1, [0, 1]], 4]
 *      [[1, [0, 1]], [2, 3]]
 *      [[1, [0, 1]], [[0, 1], 3]]
 *      [[1, [0, 1]], [[0, 1], [1, 2]]]
 *      [[1, [0, 1]], [[0, 1], [1, [0, 1]]]]
 *
 */
var genFibArr = function* (n)
{
    if (n === 0 || n === 1) yield n;
    else {
        var arr = [n - 2, n - 1];
        yield arr;

        if (arr[0] > 1) {
            for (let leftArr of genFibArr(arr[0])) {
                arr[0] = leftArr;
                yield arr;
            }
        }

        if (arr[1] > 1) {
            for (let rightArr of genFibArr(arr[1])) {
                arr[1] = rightArr;
                yield arr;
            }
        }
    }
}

for (let s of genStrings(10)) {
    console.log(s);
}   
console.log('done');

for (let s of genFibArr(5)) {
    console.log(s.toString());
}   
console.log('done');

