const MINE_RATE = 3000;

export default (previousBlock, timestamp) => {
  const { difficulty } = previousBlock;

  //incrementem o decrementem la dificultat depenent si ha superat el temps del MINE_RATE 
  return previousBlock.timestamp + MINE_RATE > timestamp
    ? difficulty + 1
    : difficulty - 1;
};
