// MNIST digits
const MNIST:DigitData[] = [];

interface TrainingInstance  {
    input: number[],
    output: number[],
}

// size of the sample images (28 x 28)
const size = 28;
const raw = await Promise.all([...Array(10).keys()].map(async d=>{;
    const json = JSON.parse (await Deno.readTextFile(`./digits/${d}.json`))
    return json.data;
}))



class DigitData {
    id: number;
    raw: number[];
    numSamples: number;
    constructor(id:number){
        this.id = id;
        this.raw = raw[this.id];
        this.numSamples = this.raw.length/(size* size);
    }
  get(which?:number) {
    // if not specified, or if invalid, pick a random sample
    if ('undefined' == typeof which || which > this.numSamples || which < 0) {
      which = Math.random() * this.numSamples;
    }

    // generate sample
    const sample = [];
    for (
      let length = size * size,
      start = which * length,
      i = 0;
      i < length;
      sample.push(this.raw[start + i++])
    );
    return sample;
  }

  // get a range of samples
  range (start:number, end:number) {
    if (start < 0)
      start = 0;
    if (end >= this.numSamples)
      end = this.numSamples - 1;
    if (start > end) {
      const tmp = start;
      start = end;
      end = tmp;
    }
    const range = [];
    for (
      let i = start;
      i <= end;
      range.push(this.get(i++))
    );
    return range;
  }

  // get set of digits, ready to be used for training or testing
  set (start:number, end:number):TrainingInstance[] {
    const set = [];
    const output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    output[this.id] = 1;
    var range = this.range(start, end);
    for (
      var i = 0;
      i < range.length;
      set.push({
        input: range[i++],
        output: output
      })
    );
    return set;
  }
}

[...Array(10).keys()].map(d=>MNIST.push(new DigitData(d)));


printNumber(MNIST[4].get())

function printNumber(n:number[]){
    for(let i = 0; i < size; i++){
        console.log("\n")
        let str = "";
        for (let j = 0; j < size; j++){
            str += (n[i+size*j]>0.2?'0':'.') + "  "
        }
        console.log(str);
    }
}


export function getSamples(count:number):TrainingInstance[]{
  let range:TrainingInstance[] = [];
  for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let current = MNIST[i];
    range = range.concat(current.set(0, current.numSamples));
  }
  range = shuffle(range);
  range = range.slice(0, count);
  return range;
}


// Generates non-overlaping training and a test sets, with the desired ammount of samples
export function getSets(trainingNumber:number, testingNumber:number):{training:TrainingInstance[],test:TrainingInstance[]} {
    let samples = getSamples(trainingNumber+ testingNumber)
  return {
    training: samples.slice(0,trainingNumber),
    test: samples.slice(trainingNumber)
  }
}

export function shuffle(v:any[]) {
  for (let j, x, i = v.length; i; j = Math.random() * i, x = v[--i], v[i] = v[j], v[j] = x);
  return v;
};


