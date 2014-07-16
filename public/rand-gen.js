/**
 *  Generates the nth fibonacci number array tree.
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
 */
var genFibArr = function* (n)
{
    if (n === 0 || n === 1) return n;
    else {
        var arr = [n - 2, n - 1];
        yield arr;

        for (let leftArr of genFibArr(arr[0])) {
            arr[0] = leftArr;
            yield arr;
        }

        for (let rightArr of genFibArr(arr[1])) {
            arr[1] = rightArr;
            yield arr;
        }
    }
}
for (let s of genFibArr(5)) {
    console.log(s.toString());

}   
