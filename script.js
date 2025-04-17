


const n = 50;
const array = [];
init();

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function play() {
  const selectedAlgo = document.getElementById("algo-select").value;
  const copy = [...array];
  let moves = [];

  switch (selectedAlgo) {
    case "bubble":
      moves = bubbleSort(copy);
      break;
    case "selection":
      moves = selectionSort(copy);
      break;
    case "insertion":
      moves = insertionSort(copy);
      break;
    case "merge":
      moves = mergeSort(copy);
      break;
    case "quick":
      moves = quickSort(copy);
      break;
    default:
      return alert("Unknown algorithm");
  }

  animate(moves);
}

function animate(moves) {
  if (moves.length === 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  } else if (move.type === "overwrite") {
    array[i] = move.value;
  }
  showBars(move);
  setTimeout(() => animate(moves), 30);
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }

    container.appendChild(bar);
  }
}

// === Sorting Algorithms ===

function bubbleSort(array) {
  const moves = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({ indices: [i - 1, i], type: "comp" });
      if (array[i - 1] > array[i]) {
        moves.push({ indices: [i - 1, i], type: "swap" });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        swapped = true;
      }
    }
  } while (swapped);
  return moves;
}

function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [j, minIdx], type: "comp" });
      if (array[j] < array[minIdx]) minIdx = j;
    }
    if (i !== minIdx) {
      moves.push({ indices: [i, minIdx], type: "swap" });
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
    }
  }
  return moves;
}

function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j] < array[j - 1]) {
      moves.push({ indices: [j, j - 1], type: "swap" });
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
      j--;
    }
  }
  return moves;
}

function mergeSort(array) {
  const moves = [];

  function merge(arr, start, end) {
    if (end - start <= 1) return;
    const mid = Math.floor((start + end) / 2);
    merge(arr, start, mid);
    merge(arr, mid, end);

    const left = arr.slice(start, mid);
    const right = arr.slice(mid, end);
    let i = start, l = 0, r = 0;

    while (l < left.length && r < right.length) {
      if (left[l] < right[r]) {
        arr[i] = left[l];
        moves.push({ indices: [i], type: "overwrite", value: left[l++] });
      } else {
        arr[i] = right[r];
        moves.push({ indices: [i], type: "overwrite", value: right[r++] });
      }
      i++;
    }

    while (l < left.length) {
      arr[i] = left[l];
      moves.push({ indices: [i], type: "overwrite", value: left[l++] });
      i++;
    }

    while (r < right.length) {
      arr[i] = right[r];
      moves.push({ indices: [i], type: "overwrite", value: right[r++] });
      i++;
    }
  }

  merge(array, 0, array.length);
  return moves;
}

function quickSort(array) {
  const moves = [];

  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low;
    for (let j = low; j < high; j++) {
      moves.push({ indices: [j, high], type: "comp" });
      if (arr[j] < pivot) {
        moves.push({ indices: [i, j], type: "swap" });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    moves.push({ indices: [i, high], type: "swap" });
    [arr[i], arr[high]] = [arr[high], arr[i]];
    return i;
  }

  function quickSortRecursive(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSortRecursive(arr, low, pi - 1);
      quickSortRecursive(arr, pi + 1, high);
    }
  }

  quickSortRecursive(array, 0, array.length - 1);
  return moves;
}
