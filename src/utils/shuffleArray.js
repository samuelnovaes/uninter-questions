const shuffleArray = (arr, maxSize) => {
  const arrCopy = [...arr];
  const shuffledArray = [];
  const size = Math.min(arr.length, maxSize);
  while(shuffledArray.length < size && arrCopy.length > 0) {
    const randomIndex = Math.floor(Math.random() * arrCopy.length);
    shuffledArray.push(arrCopy[randomIndex]);
    arrCopy.splice(randomIndex, 1);
  }
  return shuffledArray;
};

export default shuffleArray;
